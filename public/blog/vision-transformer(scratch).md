
# Vision Transformer

Paper: <https://arxiv.org/abs/2010.11929>

Reference:

1.  <https://medium.com/@brianpulfer/vision-transformers-from-scratch-pytorch-a-step-by-step-guide-96c3313c2e0c>
2.  <https://github.com/tintn/vision-transformer-from-scratch>

[Download Notebook](https://github.com/Glanceman/Python-Learning/blob/master/Transformer/vision-transformer(scratch).ipynb) 

``` python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import math
import torch
import torch.nn as nn
import torchvision.transforms as transforms
from torch.utils.data import Dataset, DataLoader
from torchvision.transforms import ToTensor
import torch.optim as optim

from pathlib import Path
```


## Dataset Mnist

``` python
class MNISTDataset(Dataset):
    def __init__(self, datapath="../CS5296/Spark/data", partition="train", transform=None):
        datapath = Path(datapath).resolve()
        if(partition=="test"):
           self.dataframe = pd.read_csv(Path.joinpath(datapath,"mnist_test.csv"))
        else:
            self.dataframe = pd.read_csv(Path.joinpath(datapath,"mnist_train.csv"))
        self.transform = transform
        self.images = self.dataframe.drop('label', axis=1).values.astype(np.float32)
        self.labels = self.dataframe['label'].values.astype(np.int64)

    def __len__(self):
        return len(self.dataframe)

    def __getitem__(self, index):
        image = self.images[index]
        label = self.labels[index]
        # Convert the image to the PyTorch tensor format (H, W, C)
        image = image.view().reshape(28,28,1)
        label = label
        if self.transform:
            image = self.transform(image)
        return image, label

train= MNISTDataset(transform=ToTensor())
test = MNISTDataset(partition="test",transform=ToTensor())
x,y = train[0]
print(x.shape,y)
```

```
    torch.Size([1, 28, 28]) 5
```

``` python
def patchify(images, n_patches):
    n, c, h, w = images.shape

    assert h == w, "Patchify method is implemented for square images only"

    patches = torch.zeros(n, n_patches ** 2, h * w * c // n_patches ** 2)
    patch_size = h // n_patches

    for idx, image in enumerate(images):
        for i in range(n_patches):
            for j in range(n_patches):
                patch = image[:, i * patch_size: (i + 1) * patch_size, j * patch_size: (j + 1) * patch_size]
                patches[idx, i * n_patches + j] = patch.flatten()
    return patches

print(x.shape)
print(patchify(x.reshape(1,1,28,28),7).shape)
```

```
    torch.Size([1, 28, 28])
    torch.Size([1, 49, 16])
```

## VIT
![VIT](https://miro.medium.com/v2/resize:fit:1100/format:webp/1*tA7xE2dQA_dfzA0Bub5TVw.png)


``` python
class MultiHeadAttention(nn.Module):
    def __init__(self,embed_dim:int=512, num_heads:int=8):
        """
        Args:
            embed_dim: dimension of embeding vector output
            num_heads: number of self attention heads
        """
        super(MultiHeadAttention,self).__init__()
        # We ensure that the dimensions of the model is divisible by the number of heads
        assert embed_dim % num_heads == 0, 'd_model is not divisible by h'

        # Initialize dimensions
        self.embed_dim = embed_dim # Model's dimension
        self.num_heads = num_heads # Number of attention heads
        self.single_head_dims = embed_dim // num_heads # Dimension of each head's key, query, and value

        # Linear layers for transforming inputs
        self.W_q = nn.Linear(embed_dim, embed_dim) # Query transformation shape:(512)
        self.W_k = nn.Linear(embed_dim, embed_dim) # Key transformation
        self.W_v = nn.Linear(embed_dim, embed_dim) # Value transformation
        self.W_o = nn.Linear(embed_dim, embed_dim) # Output transformation

    def scaled_dot_product_attention(self, Q, K, V, mask=None):
        """
        attn_scores = torch.matmul(Q, K.transpose(-2, -1)) / math.sqrt(self.embed_dim). Here, the attention scores are calculated by taking the dot product of queries (Q) and keys (K), and then scaling by the square root of the key dimension (embed_dim).

        Args:
           key : key matrix
           query : query matrix
           value : value matrix
           mask: mask for decoder
        Returns:
           output vector from multihead attention 
        """
        d_k = Q.shape[-1] 
        attention_scores = torch.matmul(Q,K.transpose(-2,-1))/math.sqrt(d_k)
        
        if mask is not None: # mask is define
            attention_scores = attention_scores.masked_fill(mask == 0, -1e9)

        attention_scores = torch.softmax(attention_scores, dim=-1) # Applying softmax
        attention_scores = torch.matmul(attention_scores,V)
        return attention_scores

    def split_heads(self, x):
        # Reshape the input to have num_heads for multi-head attention
        batch_size, seq_length, embed_dim = x.size()
        x= x.view(batch_size, seq_length, self.num_heads, self.single_head_dims)
        return x.transpose(1, 2) # shape (batch_size, self.num_heads, seq_length, self.single_head_dims)

    def combine_heads(self, x):
        # Combine the multiple heads back to original shape
        batch_size, _, seq_length, single_head_dims = x.size() #(batch_size, self.num_heads, seq_length, self.single_head_dims)
        return x.transpose(1, 2).contiguous().view(batch_size, seq_length, self.embed_dim)

    def forward(self,Q, K, V, mask=None):
        # Apply linear transformations and split heads
        Q = self.split_heads(self.W_q(Q))
        K = self.split_heads(self.W_k(K))
        V = self.split_heads(self.W_v(V))

        # Perform scaled dot-product attention
        attn_output = self.scaled_dot_product_attention(Q, K, V, mask)

        # Combine heads and apply output transformation
        output = self.W_o(self.combine_heads(attn_output))
        return output
    

class PositionWiseFeedForward(nn.Module):
    def __init__(self, d_model:int, d_ff:int):
        """
        Args:
        d_model: Dimensionality of the model's input and output.
        d_ff: Dimensionality of the inner layer in the feed-forward network.
        """
        super(PositionWiseFeedForward, self).__init__()
        self.fc1 = nn.Linear(d_model, d_ff)
        self.fc2 = nn.Linear(d_ff, d_model)
        self.GELU = nn.GELU()

    def forward(self, x):
        return self.fc2(self.GELU(self.fc1(x)))

class PositionalEncoding(nn.Module):
    def __init__(self, d_model:int, seq_length:int):
        super(PositionalEncoding, self).__init__()

        pe = torch.zeros(seq_length, d_model)
        position = torch.arange(0, seq_length, dtype=torch.float).unsqueeze(1) #[0,1,2,3,4,...]
        # Creating the division term for the positional encoding formula
        div_term = torch.exp(torch.arange(0, d_model, 2).float() * (-math.log(10000.0) / d_model))

        EvenIndexSize = int(d_model/2)
        OddIndexSize = int(math.ceil((d_model-1)/2))
        #print(EvenIndexSize,OddIndexSize)

        pe[:, 0::2] = torch.sin(position * div_term)[:,0:EvenIndexSize] # start:End:Step
        pe[:, 1::2] = torch.cos(position * div_term)[:,0:OddIndexSize] # start:End:Step

        # Returns a new tensor with a dimension of size one inserted at the specified position.
        pe.unsqueeze(0) # add batch 
        # Registering 'pe' as buffer. Buffer is a tensor not considered as a model parameter
        self.register_buffer('pe', pe.unsqueeze(0))

    def forward(self, x):
        """
        x: (batch size , seq_length, dims)
        """
        return x + self.pe[:, :x.size(1)]

class EncoderLayer(nn.Module):
    def __init__(self, d_ff, dropout, num_heads:int=8):
        super(EncoderLayer, self).__init__()

        self.layerNorm0 = nn.LayerNorm(d_ff)
        self.attention = MultiHeadAttention(embed_dim=d_ff,num_heads=num_heads)
        self.layerNorm1 = nn.LayerNorm(d_ff)        
        self.feed_forward = PositionWiseFeedForward(d_model=d_ff,d_ff=d_ff*4)
        self.dropout = nn.Dropout(dropout)

    def forward(self,x,mask):
        """
        Args:
        x: (batch size , seq_length, dims)
        mask: (seq,length)
        """
        x0=x
        x = self.layerNorm0(x)
        attn_out = self.attention(Q=x,K=x,V=x,mask=mask)
        x= x0+self.dropout(attn_out)

        x=self.layerNorm1(x)
        ff_out = self.feed_forward(x)
        x= x+self.dropout(ff_out)

        return x

class VIT(nn.Module):
    def __init__(self, num_layers, out_class, d_model:int=16, chw=(1, 28, 28), num_patches=7 , d_ff:int=128, num_heads:int=8, dropout:float=0.1):
        """
        Args:
            chw : channel, height width of a image
            n_patches: number of patches of images
            d_model: The dimensionality of the model's embeddings.
            num_heads: Number of attention heads in the multi-head attention mechanism.
            num_layers: Number of layers for both the encoder and the decoder.
            d_ff: Hidden dimemsion.
            dropout: Dropout rate for regularization.
        """
        super(VIT, self).__init__()

        self.chw = chw # (C, H, W)
        self.n_patches = num_patches

        n_w = chw[1] % num_patches
        n_v = chw[2] % num_patches
        
        assert n_w == 0, "Input shape not entirely divisible by number of patches"
        assert n_v == 0, "Input shape not entirely divisible by number of patches"

        self.linearEmbedding = nn.Linear(in_features=d_model, out_features=d_ff,device="cuda")
        # 2) Learnable classifiation token
        self.class_token = nn.Parameter(torch.rand(1, d_ff))
        #self.encoder_embedding = nn.Embedding(num_embeddings=src_vocab_size,embedding_dim=d_model)
        self.positional_encoding = PositionalEncoding(d_model=d_ff, seq_length=(n_w * n_v)+1)

        self.encoder_layers = nn.ModuleList([EncoderLayer(num_heads=num_heads, d_ff=d_ff, dropout=dropout) for _ in range(num_layers)])

        # 5) Classification MLPk
        self.mlp = nn.Linear(d_ff, out_class)
        

        self.dropout = nn.Dropout(dropout)

    def forward(self,x):
        """
        Inference step to generate predictions for the target sequence.

        Args:
            src (torch.Tensor): Input to the encoder.
            tgt (torch.Tensor): Input to the decoder.

        Returns:
            output (list): List of predicted labels for the target sequence.
        """
        #src_mask, tgt_mask = self.generate_mask(src, tgt)
        n, c, h, w = x.shape
        x = patchify(x, self.n_patches).to(x.get_device())
        x = self.linearEmbedding(x) # linear embedding

        # Create a learnable [CLS] token
        # Similar to BERT, the [CLS] token is added to the beginning of the input sequence
        # and is used to classify the entire sequence
        x = torch.cat((self.class_token.expand(n, 1, -1), x), dim=1)
        x = self.positional_encoding(x)
        x = self.dropout(x)

        for enc_layer in self.encoder_layers:
            x = enc_layer(x, None)
        

        x = x[:, 0]

        x = self.mlp(x)

        return x

#example use
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
x=x.reshape([1,1,28,28]).to(device)


model = VIT(1,10,16).to(device=device)
res = model(x)
print(res.shape)
```

```
    torch.Size([1, 10])
```

## Train

``` python
from tqdm import tqdm
import gc

trainloader = DataLoader(train, batch_size=64, shuffle=True)
testloader = DataLoader(test, batch_size=64, shuffle=True)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = VIT(2,10,16,d_ff=64).to(device)
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=0.001)

NUMS_EPOCHS = 10


for epoch in range(NUMS_EPOCHS):
    gc.collect()
    running_loss = 0.0
    model.train()
    batch_iterator = tqdm(trainloader, desc=f"Processing Epoch {epoch+1:02d}")
    for batch in batch_iterator:
        optimizer.zero_grad()
        inputs, labels = batch
        inputs, labels = inputs.to(device), labels.to(device)

        outputs = model(inputs)
        loss = criterion(outputs, labels)
        loss.backward()

        optimizer.step()
        running_loss += loss.item()
        batch_iterator.set_postfix({"loss": f"{loss.item():6.3f}"})


    print(f"Epoch [{epoch+1}/{NUMS_EPOCHS}] Avg Loss: {running_loss / len(trainloader)}")

    #Validation
    model.eval()
    with torch.no_grad():
            correct = 0
            total = 0
            for i, data in enumerate(testloader, 0):
                inputs, labels = data
                inputs, labels = inputs.to(device), labels.to(device)
                outs = model(inputs)
                pred_y = torch.max(outs, 1)[1].data.squeeze()
                accuracy = (pred_y == labels).sum().item() / float(labels.size(0))

                
    print(f'Test Accuracy of the model on the {len(testloader.dataset)} test images: %.2f' % accuracy)
```

```
    Processing Epoch 01: 100%|██████████| 938/938 [05:20<00:00,  2.93it/s, loss=0.689]
    Epoch [1/10] Avg Loss: 1.3601497532462261
    Test Accuracy of the model on the 10000 test images: 0.62
    Processing Epoch 02: 100%|██████████| 938/938 [05:21<00:00,  2.91it/s, loss=0.617]
    Epoch [2/10] Avg Loss: 0.8785603516328055
    Test Accuracy of the model on the 10000 test images: 0.56
    Processing Epoch 03: 100%|██████████| 938/938 [05:22<00:00,  2.91it/s, loss=0.925]
    Epoch [3/10] Avg Loss: 0.7391130665281435
    Test Accuracy of the model on the 10000 test images: 0.81
    Processing Epoch 04: 100%|██████████| 938/938 [05:48<00:00,  2.69it/s, loss=0.644]
    Epoch [4/10] Avg Loss: 0.6653420433306745
    Test Accuracy of the model on the 10000 test images: 0.62
    Processing Epoch 05: 100%|██████████| 938/938 [05:10<00:00,  3.02it/s, loss=0.503]
    Epoch [5/10] Avg Loss: 0.6119056683994814
    Test Accuracy of the model on the 10000 test images: 0.81
    Processing Epoch 06: 100%|██████████| 938/938 [05:10<00:00,  3.02it/s, loss=0.730]
    Epoch [6/10] Avg Loss: 0.5719451062969053
    Test Accuracy of the model on the 10000 test images: 0.75
    Processing Epoch 07: 100%|██████████| 938/938 [05:15<00:00,  2.97it/s, loss=0.477]
    Epoch [7/10] Avg Loss: 0.5406100409848096
    Test Accuracy of the model on the 10000 test images: 0.81
    Processing Epoch 08: 100%|██████████| 938/938 [05:16<00:00,  2.96it/s, loss=0.587]
    Epoch [8/10] Avg Loss: 0.5122491440126128
    Test Accuracy of the model on the 10000 test images: 0.94
    Processing Epoch 09: 100%|██████████| 938/938 [05:10<00:00,  3.02it/s, loss=0.681]
    Epoch [9/10] Avg Loss: 0.49219478865358623
    Test Accuracy of the model on the 10000 test images: 0.81
    Processing Epoch 10: 100%|██████████| 938/938 [05:04<00:00,  3.08it/s, loss=0.478]
    Epoch [10/10] Avg Loss: 0.47563877935285
    Test Accuracy of the model on the 10000 test images: 0.88
```
