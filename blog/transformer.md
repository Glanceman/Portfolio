
``` python
import torch
import torch.nn as nn
import torch.nn.functional as F
import numpy as np
import math
from torch.utils.data import Dataset, DataLoader
from torchvision import datasets, transforms
import pandas as pd 
import os
from pathlib import Path
```

</div>

<div class="cell markdown"
papermill="{&quot;duration&quot;:6.743e-3,&quot;end_time&quot;:&quot;2024-05-27T07:18:09.542573&quot;,&quot;exception&quot;:false,&quot;start_time&quot;:&quot;2024-05-27T07:18:09.535830&quot;,&quot;status&quot;:&quot;completed&quot;}"
tags="[]">

## Multihead self-attention

![Multihead image](https://i.imgur.com/JqJVrsj.png)

</div>

<div class="cell code" execution_count="2"
execution="{&quot;iopub.execute_input&quot;:&quot;2024-05-27T07:18:09.555704Z&quot;,&quot;iopub.status.busy&quot;:&quot;2024-05-27T07:18:09.555282Z&quot;,&quot;iopub.status.idle&quot;:&quot;2024-05-27T07:18:09.987776Z&quot;,&quot;shell.execute_reply&quot;:&quot;2024-05-27T07:18:09.986787Z&quot;}"
papermill="{&quot;duration&quot;:0.441505,&quot;end_time&quot;:&quot;2024-05-27T07:18:09.989975&quot;,&quot;exception&quot;:false,&quot;start_time&quot;:&quot;2024-05-27T07:18:09.548470&quot;,&quot;status&quot;:&quot;completed&quot;}"
tags="[]">

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
    
# Example usage:
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
data = torch.rand((2,4, 8)).to(device=device)  # 100 points in 20D (batch_size, seq_length, embed_dim)
head= MultiHeadAttention(embed_dim=8, num_heads=2)
head.to(device=device)
res=head(Q=data,K=data,V=data)
print(res.shape)
    
```

<div class="output stream stdout">

    torch.Size([2, 4, 8])

</div>

</div>

<div class="cell markdown"
papermill="{&quot;duration&quot;:5.909e-3,&quot;end_time&quot;:&quot;2024-05-27T07:18:10.002090&quot;,&quot;exception&quot;:false,&quot;start_time&quot;:&quot;2024-05-27T07:18:09.996181&quot;,&quot;status&quot;:&quot;completed&quot;}"
tags="[]">

## Feed-Forward Network

*F**F**N*(*X*) = *W*<sub>2</sub>*m**a**x*(0,*W*<sub>1</sub>*x*+*b*<sub>1</sub>) + *b*<sub>2</sub>

</div>

<div class="cell code" execution_count="3"
execution="{&quot;iopub.execute_input&quot;:&quot;2024-05-27T07:18:10.015204Z&quot;,&quot;iopub.status.busy&quot;:&quot;2024-05-27T07:18:10.014920Z&quot;,&quot;iopub.status.idle&quot;:&quot;2024-05-27T07:18:10.254214Z&quot;,&quot;shell.execute_reply&quot;:&quot;2024-05-27T07:18:10.253380Z&quot;}"
papermill="{&quot;duration&quot;:0.248349,&quot;end_time&quot;:&quot;2024-05-27T07:18:10.256470&quot;,&quot;exception&quot;:false,&quot;start_time&quot;:&quot;2024-05-27T07:18:10.008121&quot;,&quot;status&quot;:&quot;completed&quot;}"
tags="[]">

``` python
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
        self.relu = nn.ReLU()

    def forward(self, x):
        return self.fc2(self.relu(self.fc1(x)))
    
# Example usage:
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")    
pe=PositionWiseFeedForward(d_model=3,d_ff=2).to(device)
print(list(pe.parameters()))
data = torch.rand((2,5,3)).to(device=device)  # 100 points in 20D (batch_size, seq_length, embed_dim)
res=pe(data)
print(res.shape)
```

<div class="output stream stdout">

    [Parameter containing:
    tensor([[-0.1662,  0.5394, -0.0850],
            [-0.4150,  0.0663, -0.0619]], device='cuda:0', requires_grad=True), Parameter containing:
    tensor([-0.0362, -0.4348], device='cuda:0', requires_grad=True), Parameter containing:
    tensor([[ 0.3268, -0.7022],
            [ 0.3915, -0.4777],
            [-0.2185, -0.3007]], device='cuda:0', requires_grad=True), Parameter containing:
    tensor([-0.2021, -0.1976,  0.0210], device='cuda:0', requires_grad=True)]
    torch.Size([2, 5, 3])

</div>

</div>

<div class="cell markdown"
papermill="{&quot;duration&quot;:5.934e-3,&quot;end_time&quot;:&quot;2024-05-27T07:18:10.268678&quot;,&quot;exception&quot;:false,&quot;start_time&quot;:&quot;2024-05-27T07:18:10.262744&quot;,&quot;status&quot;:&quot;completed&quot;}"
tags="[]">

## Positional Encoding

\\begin{align\*}

Even indices(2i) : PE(pos,2i) =
sin(\\frac{pos}{1000^{\\frac{2i}{d-model}}})

\\end{align\*}

\\begin{align\*}

Odd indices(2i+1) : PE(pos,2i+1) =
cos(\\frac{pos}{1000^{\\frac{2i}{d-model}}})

\\end{align\*}

shape(pos,i)

</div>

<div class="cell code" execution_count="4"
execution="{&quot;iopub.execute_input&quot;:&quot;2024-05-27T07:18:10.282002Z&quot;,&quot;iopub.status.busy&quot;:&quot;2024-05-27T07:18:10.281738Z&quot;,&quot;iopub.status.idle&quot;:&quot;2024-05-27T07:18:10.367023Z&quot;,&quot;shell.execute_reply&quot;:&quot;2024-05-27T07:18:10.366019Z&quot;}"
papermill="{&quot;duration&quot;:9.415e-2,&quot;end_time&quot;:&quot;2024-05-27T07:18:10.368968&quot;,&quot;exception&quot;:false,&quot;start_time&quot;:&quot;2024-05-27T07:18:10.274818&quot;,&quot;status&quot;:&quot;completed&quot;}"
tags="[]">

``` python
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

# Example usage:
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")    
pe=PositionalEncoding(d_model=784,seq_length=5).to(device)
print(list(pe.parameters()))
data = torch.rand((2,5,784)).to(device=device)  # 100 points in 20D (nums_seq, seq_length, embed_dim)
res=pe(data)
print(res.shape)
```

<div class="output stream stdout">

    []
    torch.Size([2, 5, 784])

</div>

</div>

<div class="cell markdown"
papermill="{&quot;duration&quot;:6.02e-3,&quot;end_time&quot;:&quot;2024-05-27T07:18:10.381135&quot;,&quot;exception&quot;:false,&quot;start_time&quot;:&quot;2024-05-27T07:18:10.375115&quot;,&quot;status&quot;:&quot;completed&quot;}"
tags="[]">

## Encoder Block

![Encode
block](https://images.datacamp.com/image/upload/v1691083306/Figure_2_The_Encoder_part_of_the_transformer_network_Source_image_from_the_original_paper_b0e3ac40fa.png)

</div>

<div class="cell code" execution_count="5"
execution="{&quot;iopub.execute_input&quot;:&quot;2024-05-27T07:18:10.396189Z&quot;,&quot;iopub.status.busy&quot;:&quot;2024-05-27T07:18:10.395229Z&quot;,&quot;iopub.status.idle&quot;:&quot;2024-05-27T07:18:10.442051Z&quot;,&quot;shell.execute_reply&quot;:&quot;2024-05-27T07:18:10.441238Z&quot;}"
papermill="{&quot;duration&quot;:5.6788e-2,&quot;end_time&quot;:&quot;2024-05-27T07:18:10.444443&quot;,&quot;exception&quot;:false,&quot;start_time&quot;:&quot;2024-05-27T07:18:10.387655&quot;,&quot;status&quot;:&quot;completed&quot;}"
tags="[]">

``` python
class EncoderLayer(nn.Module):
    def __init__(self, d_ff, dropout, d_model:int=512, num_heads:int=8):
        super(EncoderLayer, self).__init__()
        self.attention = MultiHeadAttention(embed_dim=d_model,num_heads=num_heads)
        self.feed_forward = PositionWiseFeedForward(d_model=d_model,d_ff=d_ff)
        self.layerNorm0 = nn.LayerNorm(d_model)
        self.layerNorm1 = nn.LayerNorm(d_model)
        self.dropout = nn.Dropout(dropout)

    def forward(self,x,mask):
        """
        Args:
        x: (batch size , seq_length, dims)
        mask: (seq,length)
        """
        attn_out = self.attention.forward(Q=x,K=x,V=x,mask=mask)
        x = self.layerNorm0( x + self.dropout(attn_out))
        
        ff_out = self.feed_forward(x)
        x = self.layerNorm1( x + self.dropout(ff_out))
        return x

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")    
encoder=EncoderLayer(d_model=4,num_heads=2,d_ff=3,dropout=0.2).to(device)
data = torch.rand((2,5,4)).to(device=device)  # 100 points in 20D (batch_size, seq_length, embed_dim)
res=encoder.forward(data,mask=None)
print(res.shape)
```

<div class="output stream stdout">

    torch.Size([2, 5, 4])

</div>

</div>

<div class="cell markdown"
papermill="{&quot;duration&quot;:6.399e-3,&quot;end_time&quot;:&quot;2024-05-27T07:18:10.457519&quot;,&quot;exception&quot;:false,&quot;start_time&quot;:&quot;2024-05-27T07:18:10.451120&quot;,&quot;status&quot;:&quot;completed&quot;}"
tags="[]">

## Decoder Block

![Decoder
block](https://images.datacamp.com/image/upload/v1691083444/Figure_3_The_Decoder_part_of_the_Transformer_network_Souce_Image_from_the_original_paper_b90d9e7f66.png)

</div>

<div class="cell code" execution_count="6"
execution="{&quot;iopub.execute_input&quot;:&quot;2024-05-27T07:18:10.472868Z&quot;,&quot;iopub.status.busy&quot;:&quot;2024-05-27T07:18:10.472534Z&quot;,&quot;iopub.status.idle&quot;:&quot;2024-05-27T07:18:10.497318Z&quot;,&quot;shell.execute_reply&quot;:&quot;2024-05-27T07:18:10.495993Z&quot;}"
papermill="{&quot;duration&quot;:3.4738e-2,&quot;end_time&quot;:&quot;2024-05-27T07:18:10.499313&quot;,&quot;exception&quot;:false,&quot;start_time&quot;:&quot;2024-05-27T07:18:10.464575&quot;,&quot;status&quot;:&quot;completed&quot;}"
tags="[]">

``` python
class DecoderLayer(nn.Module):
    def __init__(self, d_model, num_heads, d_ff, dropout):
        super(DecoderLayer, self).__init__()
        self.maskedAttn =MultiHeadAttention(embed_dim=d_model,num_heads=num_heads)
        self.layerNorm0 = nn.LayerNorm(d_model)
        self.crossAttn = MultiHeadAttention(embed_dim=d_model,num_heads=num_heads)
        self.layerNorm1 = nn.LayerNorm(d_model)
        self.feedForward = PositionWiseFeedForward(d_model=d_model,d_ff=d_ff)
        self.layerNorm2 = nn.LayerNorm(d_model)
        self.dropout=nn.Dropout(dropout)


    def forward(self,x,encoder_output,src_mask,tgt_mask):
        
        attn_output = self.maskedAttn(x, x, x, tgt_mask)
        x= self.layerNorm0(x + self.dropout(attn_output))
        
        cross_attn_output = self.crossAttn(x ,encoder_output, encoder_output, src_mask)
        x= self.layerNorm1(x + self.dropout(cross_attn_output))
        
        ff_out = self.feedForward(x)
        x= self.layerNorm2( x + self.dropout(ff_out))
        
        return x
    
#example usage
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")    
decoder=DecoderLayer(d_model=4,num_heads=2,d_ff=3,dropout=0.2).to(device)
data = torch.rand((2,5,4)).to(device=device)  # 100 points in 20D (batch_size, seq_length, embed_dim)
res=decoder.forward(x=data[:2,:-1,:4],encoder_output=data,src_mask=None,tgt_mask=None)
print(res.shape)
```

<div class="output stream stdout">

    torch.Size([2, 4, 4])

</div>

</div>

<div class="cell markdown"
papermill="{&quot;duration&quot;:6.378e-3,&quot;end_time&quot;:&quot;2024-05-27T07:18:10.512708&quot;,&quot;exception&quot;:false,&quot;start_time&quot;:&quot;2024-05-27T07:18:10.506330&quot;,&quot;status&quot;:&quot;completed&quot;}"
tags="[]">

## Transformer Model

![transformer](https://images.datacamp.com/image/upload/v1691083566/Figure_4_The_Transformer_Network_Source_Image_from_the_original_paper_120e177956.png)

</div>

<div class="cell code" execution_count="7"
execution="{&quot;iopub.execute_input&quot;:&quot;2024-05-27T07:18:10.527105Z&quot;,&quot;iopub.status.busy&quot;:&quot;2024-05-27T07:18:10.526767Z&quot;,&quot;iopub.status.idle&quot;:&quot;2024-05-27T07:18:10.895492Z&quot;,&quot;shell.execute_reply&quot;:&quot;2024-05-27T07:18:10.894130Z&quot;}"
papermill="{&quot;duration&quot;:0.378645,&quot;end_time&quot;:&quot;2024-05-27T07:18:10.897915&quot;,&quot;exception&quot;:false,&quot;start_time&quot;:&quot;2024-05-27T07:18:10.519270&quot;,&quot;status&quot;:&quot;completed&quot;}"
tags="[]">

``` python
class Transformer(nn.Module):
    def __init__(self, src_vocab_size, tgt_vocab_size, d_model, num_heads, num_layers, d_ff, max_seq_length, dropout):
        """
        Args:
            src_vocab_size: Source vocabulary size (analogy input channels)
            tgt_vocab_size: Target vocabulary size (analogy output channels)
            d_model: The dimensionality of the model's embeddings.
            num_heads: Number of attention heads in the multi-head attention mechanism.
            num_layers: Number of layers for both the encoder and the decoder.
            d_ff: Dimensionality of the inner layer in the feed-forward network.
            max_seq_length: Maximum sequence length for positional encoding.
            dropout: Dropout rate for regularization.
        """
        super(Transformer, self).__init__()

        self.encoder_embedding = nn.Embedding(num_embeddings=src_vocab_size,embedding_dim=d_model)
        self.decoder_embedding = nn.Embedding(num_embeddings=tgt_vocab_size,embedding_dim=d_model)
        self.positional_encoding = PositionalEncoding(d_model=d_model, seq_length=max_seq_length)

        self.encoder_layers = nn.ModuleList([EncoderLayer(d_model=d_model, num_heads=num_heads, d_ff=d_ff, dropout=dropout) for _ in range(num_layers)])
        self.decoder_layers = nn.ModuleList([DecoderLayer(d_model=d_model, num_heads=num_heads, d_ff=d_ff, dropout=dropout) for _ in range(num_layers)])

        self.fc = nn.Linear(in_features=d_model, out_features=tgt_vocab_size)
        self.dropout = nn.Dropout(dropout)

    def generate_mask(self, src, tgt):
        """
        create masks for the source and target sequences, ensuring that padding tokens are ignored and that future tokens are not visible during training for the target sequence.

        """
        src_mask = (src != 0).unsqueeze(1).unsqueeze(2)
        tgt_mask = (tgt != 0).unsqueeze(1).unsqueeze(3)
        seq_length = tgt.size(1)
        nopeak_mask = (1 - torch.triu(torch.ones(1, seq_length, seq_length, device=tgt_mask.get_device()), diagonal=1)).bool() # triu -> remove diagonal in symmertic matrix 
        tgt_mask = tgt_mask & nopeak_mask
        return src_mask, tgt_mask
    
    def forward(self, src, tgt,src_mask=None, tgt_mask=None):
        """
        Inference step to generate predictions for the target sequence.

        Args:
            src (torch.Tensor): Input to the encoder.
            tgt (torch.Tensor): Input to the decoder.

        Returns:
            output (list): List of predicted labels for the target sequence.
        """
        #src_mask, tgt_mask = self.generate_mask(src, tgt)

        src_embedded = self.encoder_embedding(src) # (nums_seq, seq_length) -> (nums_seq, seq_length, dims)
        src_embedded = self.positional_encoding(src_embedded)
        src_embedded = self.dropout(src_embedded)

        tgt_embedded = self.decoder_embedding(tgt)
        tgt_embedded = self.positional_encoding(tgt_embedded)
        tgt_embedded  = self.dropout(tgt_embedded)
        
        enc_output = src_embedded
        for enc_layer in self.encoder_layers:
            enc_output = enc_layer(enc_output, src_mask)

        dec_output = tgt_embedded
        for dec_layer in self.decoder_layers:
            dec_output = dec_layer(dec_output, enc_output, src_mask, tgt_mask)

        output = self.fc(dec_output)
        return output
    
#example usage
""" 
# Generate random sample data
src_data = torch.randint(low=1, high=src_vocab_size, size= (64, max_seq_length))  # (batch_size, seq_length) (64,256)
tgt_data = torch.randint(1, tgt_vocab_size, (64, max_seq_length))  # (batch_size, seq_length)

"""

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")    
model=Transformer(src_vocab_size=255, tgt_vocab_size=255,d_model=128,num_heads=2,num_layers=1,d_ff=3,max_seq_length=784,dropout=0.2).to(device)
data = torch.randint(low=1, high=255, size= (8,350)).to(device=device)  # 100 points in 20D (num_seq, seq_length)
src = data
tgt =data[:,:]
print(src.shape, tgt.shape)
res=model(src=src,tgt=tgt)
print(res.shape)
```

<div class="output stream stdout">

    torch.Size([8, 350]) torch.Size([8, 350])
    torch.Size([8, 350, 255])

</div>

</div>

<div class="cell markdown"
papermill="{&quot;duration&quot;:7.33e-3,&quot;end_time&quot;:&quot;2024-05-27T07:18:10.913072&quot;,&quot;exception&quot;:false,&quot;start_time&quot;:&quot;2024-05-27T07:18:10.905742&quot;,&quot;status&quot;:&quot;completed&quot;}"
tags="[]">

## Training

</div>

<div class="cell code" execution_count="8"
execution="{&quot;iopub.execute_input&quot;:&quot;2024-05-27T07:18:10.929555Z&quot;,&quot;iopub.status.busy&quot;:&quot;2024-05-27T07:18:10.929180Z&quot;,&quot;iopub.status.idle&quot;:&quot;2024-05-27T07:18:12.554044Z&quot;,&quot;shell.execute_reply&quot;:&quot;2024-05-27T07:18:12.552800Z&quot;}"
papermill="{&quot;duration&quot;:1.635598,&quot;end_time&quot;:&quot;2024-05-27T07:18:12.556207&quot;,&quot;exception&quot;:false,&quot;start_time&quot;:&quot;2024-05-27T07:18:10.920609&quot;,&quot;status&quot;:&quot;completed&quot;}"
tags="[]">

``` python
import torch.optim as optim
from torch.optim.lr_scheduler import CosineAnnealingLR

src_vocab_size = 5000
tgt_vocab_size = 5000
d_model = 512
num_heads = 8
num_layers = 6
d_ff = 2048
max_seq_length = 100
dropout = 0.1

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")  
transformer = Transformer(src_vocab_size, tgt_vocab_size, d_model, num_heads, num_layers, d_ff, max_seq_length, dropout)
transformer = transformer.to(device)

# Generate random sample data
src_data = torch.randint(1, src_vocab_size, (64, max_seq_length))  # (batch_size, seq_length)
src_data = src_data.to(device=device)
tgt_data = torch.randint(1, tgt_vocab_size, (64, max_seq_length))  # (batch_size, seq_length)
tgt_data = tgt_data.to(device=device)



criterion = nn.CrossEntropyLoss(ignore_index=0)
optimizer = optim.Adam(transformer.parameters(), lr=0.0001, betas=(0.9, 0.98), eps=1e-9)

transformer.train()

num_epochs = 2
for epoch in range(num_epochs):
    optimizer.zero_grad()
    output = transformer(src_data, tgt_data[:,1:])
    loss = criterion(output.contiguous().view(-1, tgt_vocab_size), tgt_data[:, 1:].contiguous().view(-1))
    loss.backward()
    optimizer.step()
    print(f"Epoch: {epoch+1}, Loss: {loss.item()}")


transformer.eval()

# Generate random sample validation data
val_src_data = torch.randint(1, src_vocab_size, (64, max_seq_length)).to(device=device)  # (batch_size, seq_length)
val_tgt_data = torch.randint(1, tgt_vocab_size, (64, max_seq_length)).to(device=device)  # (batch_size, seq_length)

with torch.no_grad():

    val_output = transformer(val_src_data, val_tgt_data[:, :-1])
    val_loss = criterion(val_output.contiguous().view(-1, tgt_vocab_size), val_tgt_data[:, 1:].contiguous().view(-1))
    print(f"Validation Loss: {val_loss.item()}")

```

<div class="output stream stdout">

    Epoch: 1, Loss: 8.680485725402832
    Epoch: 2, Loss: 8.536981582641602
    Validation Loss: 8.670391082763672

</div>

</div>

<div class="cell markdown"
papermill="{&quot;duration&quot;:6.475e-3,&quot;end_time&quot;:&quot;2024-05-27T07:18:12.570408&quot;,&quot;exception&quot;:false,&quot;start_time&quot;:&quot;2024-05-27T07:18:12.563933&quot;,&quot;status&quot;:&quot;completed&quot;}"
tags="[]">

## Opus dataset

<https://huggingface.co/datasets/Helsinki-NLP/opus-100/viewer/en-zh>

</div>

<div class="cell code" execution_count="9"
execution="{&quot;iopub.execute_input&quot;:&quot;2024-05-27T07:18:12.585152Z&quot;,&quot;iopub.status.busy&quot;:&quot;2024-05-27T07:18:12.584873Z&quot;,&quot;iopub.status.idle&quot;:&quot;2024-05-27T07:18:22.876729Z&quot;,&quot;shell.execute_reply&quot;:&quot;2024-05-27T07:18:22.875849Z&quot;}"
papermill="{&quot;duration&quot;:10.301929,&quot;end_time&quot;:&quot;2024-05-27T07:18:22.878956&quot;,&quot;exception&quot;:false,&quot;start_time&quot;:&quot;2024-05-27T07:18:12.577027&quot;,&quot;status&quot;:&quot;completed&quot;}"
tags="[]">

``` python
from torch.utils.data import random_split, DataLoader,Dataset

from datasets import load_dataset
from tokenizers import Tokenizer
from tokenizers.models import WordLevel
from tokenizers.trainers import WordLevelTrainer
from tokenizers.pre_tokenizers import Whitespace
from tqdm import tqdm
from torch.utils.tensorboard import SummaryWriter

class BilingualDataset(Dataset):

    def __init__(self, ds, tokenizer_src, tokenizer_tgt, src_lang, tgt_lang, seq_len):
        super().__init__()
        self.seq_len = seq_len

        self.ds = ds
        self.tokenizer_src = tokenizer_src
        self.tokenizer_tgt = tokenizer_tgt
        self.src_lang = src_lang
        self.tgt_lang = tgt_lang

        self.sos_token = torch.tensor([tokenizer_tgt.token_to_id("[SOS]")], dtype=torch.int64)
        self.eos_token = torch.tensor([tokenizer_tgt.token_to_id("[EOS]")], dtype=torch.int64)
        self.pad_token = torch.tensor([tokenizer_tgt.token_to_id("[PAD]")], dtype=torch.int64)

    def __len__(self):
        return len(self.ds)

    def __getitem__(self, idx):
        src_target_pair = self.ds[idx]
        src_text = src_target_pair['translation'][self.src_lang]
        tgt_text = src_target_pair['translation'][self.tgt_lang]

        # Transform the text into tokens
        enc_input_tokens = self.tokenizer_src.encode(src_text).ids
        dec_input_tokens = self.tokenizer_tgt.encode(tgt_text).ids

        # Add sos, eos and padding to each sentence
        enc_num_padding_tokens = self.seq_len - len(enc_input_tokens) - 2  # We will add <s> and </s>
        # We will only add <s>, and </s> only on the label
        dec_num_padding_tokens = self.seq_len - len(dec_input_tokens) - 1

        # Make sure the number of padding tokens is not negative. If it is, the sentence is too long
        if enc_num_padding_tokens < 0 or dec_num_padding_tokens < 0:
            raise ValueError("Sentence is too long")

        # Add <s> and </s> token
        encoder_input = torch.cat(
            [
                self.sos_token,
                torch.tensor(enc_input_tokens, dtype=torch.int64),
                self.eos_token,
                torch.tensor([self.pad_token] * enc_num_padding_tokens, dtype=torch.int64), #add padding 
            ],
            dim=0,
        )

        # Add only <s> token
        decoder_input = torch.cat(
            [
                self.sos_token,
                torch.tensor(dec_input_tokens, dtype=torch.int64),
                torch.tensor([self.pad_token] * dec_num_padding_tokens, dtype=torch.int64),
            ],
            dim=0,
        )

        # Add only </s> token
        label = torch.cat(
            [
                torch.tensor(dec_input_tokens, dtype=torch.int64),
                self.eos_token,
                torch.tensor([self.pad_token] * dec_num_padding_tokens, dtype=torch.int64),
            ],
            dim=0,
        )

        # Double check the size of the tensors to make sure they are all seq_len long
        assert encoder_input.size(0) == self.seq_len
        assert decoder_input.size(0) == self.seq_len
        assert label.size(0) == self.seq_len

        return {
            "encoder_input": encoder_input,  # (seq_len)
            "decoder_input": decoder_input,  # (seq_len)
            "encoder_mask": (encoder_input != self.pad_token).unsqueeze(0).unsqueeze(0).int(), # (1, 1, seq_len)
            "decoder_mask": (decoder_input != self.pad_token).unsqueeze(0).int() & causal_mask(decoder_input.size(0)), # (1, seq_len) & (1, seq_len, seq_len),
            "label": label,  # (seq_len)
            "src_text": src_text,
            "tgt_text": tgt_text,
        }
    
def causal_mask(size):
    mask = torch.triu(torch.ones((1, size, size)), diagonal=1).type(torch.int)
    return mask == 0

def get_all_sentences(ds, lang):
    for item in ds:
        yield item['translation'][lang]

def get_or_build_tokenizer(config, ds, lang):
    tokenizer_path = Path(config['tokenizer_file'].format(lang)) #config['tokenizer_file']="../tokeners/tokenizer{0}.json"
    if not Path.exists(tokenizer_path):
        # Most code taken from: https://huggingface.co/docs/tokenizers/quicktour
        tokenizer = Tokenizer(WordLevel(unk_token="[UNK]"))
        tokenizer.pre_tokenizer = Whitespace() # splite by white space 
        trainer = WordLevelTrainer(special_tokens=["[UNK]", "[PAD]", "[SOS]", "[EOS]"], min_frequency=2)
        tokenizer.train_from_iterator(get_all_sentences(ds, lang), trainer=trainer)
        tokenizer.save(str(tokenizer_path))
    else: # get tokenizer from the path
        tokenizer = Tokenizer.from_file(str(tokenizer_path))
    return tokenizer
    
def get_ds(config): # get dataset
    # It only has the train split, so we divide it overselves
    ds_raw = load_dataset(f"{config['datasource']}", f"{config['lang_src']}-{config['lang_tgt']}",cache_dir="./data_cache", split='train') #download dataset from hugging face

    # Build tokenizers
    tokenizer_src = get_or_build_tokenizer(config, ds_raw, config['lang_src'])
    tokenizer_tgt = get_or_build_tokenizer(config, ds_raw, config['lang_tgt'])

    # Keep 90% for training, 10% for validation
    train_ds_size = int(0.9 * len(ds_raw))
    val_ds_size = len(ds_raw) - train_ds_size
    train_ds_raw, val_ds_raw = random_split(ds_raw, [train_ds_size, val_ds_size])

    train_ds = BilingualDataset(train_ds_raw, tokenizer_src, tokenizer_tgt, config['lang_src'], config['lang_tgt'], config['seq_len'])
    val_ds = BilingualDataset(val_ds_raw, tokenizer_src, tokenizer_tgt, config['lang_src'], config['lang_tgt'], config['seq_len'])

    # Find the maximum length of each sentence in the source and target sentence
    max_len_src = 0
    max_len_tgt = 0

    for item in ds_raw:
        src_ids = tokenizer_src.encode(item['translation'][config['lang_src']]).ids
        tgt_ids = tokenizer_tgt.encode(item['translation'][config['lang_tgt']]).ids
        max_len_src = max(max_len_src, len(src_ids))
        max_len_tgt = max(max_len_tgt, len(tgt_ids))

    print(f'Max length of source sentence: {max_len_src}')
    print(f'Max length of target sentence: {max_len_tgt}')
    

    train_dataloader = DataLoader(train_ds, batch_size=config['batch_size'], shuffle=True)
    val_dataloader = DataLoader(val_ds, batch_size=1, shuffle=True)

    return train_dataloader, val_dataloader, tokenizer_src, tokenizer_tgt

```

<div class="output stream stderr">

    2024-05-27 07:18:15.062993: E external/local_xla/xla/stream_executor/cuda/cuda_dnn.cc:9261] Unable to register cuDNN factory: Attempting to register factory for plugin cuDNN when one has already been registered
    2024-05-27 07:18:15.063089: E external/local_xla/xla/stream_executor/cuda/cuda_fft.cc:607] Unable to register cuFFT factory: Attempting to register factory for plugin cuFFT when one has already been registered
    2024-05-27 07:18:15.190070: E external/local_xla/xla/stream_executor/cuda/cuda_blas.cc:1515] Unable to register cuBLAS factory: Attempting to register factory for plugin cuBLAS when one has already been registered

</div>

</div>

<div class="cell markdown"
papermill="{&quot;duration&quot;:6.798e-3,&quot;end_time&quot;:&quot;2024-05-27T07:18:22.892911&quot;,&quot;exception&quot;:false,&quot;start_time&quot;:&quot;2024-05-27T07:18:22.886113&quot;,&quot;status&quot;:&quot;completed&quot;}"
tags="[]">

## config

</div>

<div class="cell code" execution_count="10"
execution="{&quot;iopub.execute_input&quot;:&quot;2024-05-27T07:18:22.907613Z&quot;,&quot;iopub.status.busy&quot;:&quot;2024-05-27T07:18:22.907099Z&quot;,&quot;iopub.status.idle&quot;:&quot;2024-05-27T07:18:22.914950Z&quot;,&quot;shell.execute_reply&quot;:&quot;2024-05-27T07:18:22.914135Z&quot;}"
papermill="{&quot;duration&quot;:1.7306e-2,&quot;end_time&quot;:&quot;2024-05-27T07:18:22.916867&quot;,&quot;exception&quot;:false,&quot;start_time&quot;:&quot;2024-05-27T07:18:22.899561&quot;,&quot;status&quot;:&quot;completed&quot;}"
tags="[]">

``` python
def get_config():
    return {
        "batch_size": 32,
        "num_epochs": 25,
        "lr": 10**-4,
        "seq_len": 350,
        "d_model": 512,
        "datasource": 'opus_books',
        "lang_src": "en",
        "lang_tgt": "it",
        "model_folder": "weights",
        "model_basename": "tmodel_",
        "preload": "latest",
        "tokenizer_file": "tokenizer_{0}.json",
        "experiment_name": "runs/tmodel"
    }


def get_weights_file_path(config, epoch: str):
    model_folder = f"{config['datasource']}_{config['model_folder']}"
    model_filename = f"{config['model_basename']}{epoch}.pt"
    return str(Path('.') / model_folder / model_filename)

# Find the latest weights file in the weights folder
def latest_weights_file_path(config):
    model_folder = f"{config['datasource']}_{config['model_folder']}"
    model_filename = f"{config['model_basename']}*"
    weights_files = list(Path(model_folder).glob(model_filename))
    if len(weights_files) == 0:
        return None
    weights_files.sort()
    return str(weights_files[-1])
```

</div>

<div class="cell code" execution_count="11"
execution="{&quot;iopub.execute_input&quot;:&quot;2024-05-27T07:18:22.931676Z&quot;,&quot;iopub.status.busy&quot;:&quot;2024-05-27T07:18:22.931002Z&quot;,&quot;iopub.status.idle&quot;:&quot;2024-05-27T07:18:22.944214Z&quot;,&quot;shell.execute_reply&quot;:&quot;2024-05-27T07:18:22.943441Z&quot;}"
papermill="{&quot;duration&quot;:2.2561e-2,&quot;end_time&quot;:&quot;2024-05-27T07:18:22.946096&quot;,&quot;exception&quot;:false,&quot;start_time&quot;:&quot;2024-05-27T07:18:22.923535&quot;,&quot;status&quot;:&quot;completed&quot;}"
tags="[]">

``` python
#Validation code
def greedy_decode(model, source, source_mask, tokenizer_src, tokenizer_tgt, max_len, device):
    sos_idx = tokenizer_tgt.token_to_id('[SOS]')
    eos_idx = tokenizer_tgt.token_to_id('[EOS]')

    # Precompute the encoder output and reuse it for every step
    #encoder_output = model.encode(source, source_mask)
    
    # Initialize the decoder input with the sos token
    decoder_input = torch.empty(1, 1).fill_(sos_idx).type_as(source).to(device)

    while True:
        if decoder_input.size(1) == max_len:
            break

        # build mask for target
        decoder_mask = causal_mask(decoder_input.size(1)).type_as(source_mask).to(device)

        # calculate output
        #out = model.decode(encoder_output, source_mask, decoder_input, decoder_mask)
        out= model(src=source, tgt=decoder_input, src_mask=source_mask, tgt_mask=decoder_mask)
        
        # get next token
        #print(f"{out.shape} -> {out[:, -1].shape}")
        prob = torch.log_softmax(out[:, -1],dim = -1) # take last predict
        
        _, next_word = torch.max(prob, dim=1)
        decoder_input = torch.cat(
            [decoder_input, torch.empty(1, 1).type_as(source).fill_(next_word.item()).to(device)], dim=1
        )

        if next_word == eos_idx:
            break

    return decoder_input.squeeze(0)

def run_validation(model, validation_ds, tokenizer_src, tokenizer_tgt, max_len, device, print_msg, global_state, writer, num_examples=2):
    model.eval()
    count = 0

    source_texts = []
    expected = []
    predicted = []
    console_width = 80
    
    with torch.no_grad():
        for batch in validation_ds:
            count += 1
            encoder_input = batch["encoder_input"].to(device) # (b, seq_len)
            encoder_mask = batch["encoder_mask"].to(device) # (b, 1, 1, seq_len)

                # check that the batch size is 1
            assert encoder_input.size(
                0) == 1, "Batch size must be 1 for validation"

            model_out = greedy_decode(model, encoder_input, encoder_mask, tokenizer_src, tokenizer_tgt, max_len, device)

            source_text = batch["src_text"][0]
            target_text = batch["tgt_text"][0]
            model_out_text = tokenizer_tgt.decode(model_out.detach().cpu().numpy())

            source_texts.append(source_text)
            expected.append(target_text)
            predicted.append(model_out_text)

            # Print the source, target and model output
            print_msg('-'*console_width)
            print_msg(f"{f'SOURCE: ':>12}{source_text}")
            print_msg(f"{f'TARGET: ':>12}{target_text}")
            print_msg(f"{f'PREDICTED: ':>12}{model_out_text}")

            if count == num_examples:
                print_msg('-'*console_width)
                break
    
```

</div>

<div class="cell code" execution_count="12"
execution="{&quot;iopub.execute_input&quot;:&quot;2024-05-27T07:18:22.960698Z&quot;,&quot;iopub.status.busy&quot;:&quot;2024-05-27T07:18:22.960404Z&quot;,&quot;iopub.status.idle&quot;:&quot;2024-05-27T11:27:22.250202Z&quot;,&quot;shell.execute_reply&quot;:&quot;2024-05-27T11:27:22.249142Z&quot;}"
papermill="{&quot;duration&quot;:14939.300308,&quot;end_time&quot;:&quot;2024-05-27T11:27:22.253043&quot;,&quot;exception&quot;:false,&quot;start_time&quot;:&quot;2024-05-27T07:18:22.952735&quot;,&quot;status&quot;:&quot;completed&quot;}"
tags="[]">

``` python
config = get_config()

#training 
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print("Using device:", device)
if (device == 'cuda'):
    print(f"Device name: {torch.cuda.get_device_name(device.index)}")
    print(f"Device memory: {torch.cuda.get_device_properties(device.index).total_memory / 1024 ** 3} GB")

    
Path(f"{config['datasource']}_{config['model_folder']}").mkdir(parents=True, exist_ok=True) 

train_dataloader, val_dataloader, tokenizer_src, tokenizer_tgt = get_ds(config)    
model=Transformer(tokenizer_src.get_vocab_size(), tokenizer_tgt.get_vocab_size(),d_model=config['d_model'],num_heads=8,num_layers=6,d_ff=512,max_seq_length=config['seq_len'],dropout=0.15).to(device)

writer = SummaryWriter(config['experiment_name'])
optimizer = torch.optim.Adam(model.parameters(), lr=config['lr'], eps = 1e-9)
loss_fn = nn.CrossEntropyLoss(ignore_index=tokenizer_src.token_to_id('[PAD]'), label_smoothing=0.1).to(device)
# If the user specified a model to preload before training, load it
initial_epoch = 0
global_step = 0
preload = config['preload']
model_filename = latest_weights_file_path(config) if preload == 'latest' else get_weights_file_path(config, preload) if preload else None
if model_filename:
    print(f'Preloading model {model_filename}')
    state = torch.load(model_filename)
    model.load_state_dict(state['model_state_dict'])
    initial_epoch = state['epoch'] + 1
    optimizer.load_state_dict(state['optimizer_state_dict'])
    global_step = state['global_step']
else:
    print('No model to preload, starting from scratch')
    

for epoch in range(initial_epoch, config['num_epochs']):
    torch.cuda.empty_cache()
    model.train()
    batch_iterator = tqdm(train_dataloader, desc=f"Processing Epoch {epoch:02d}")
    for batch in batch_iterator:

        encoder_input = batch['encoder_input'].to(device) # (B, seq_len)
        decoder_input = batch['decoder_input'].to(device) # (B, seq_len)
        encoder_mask = batch['encoder_mask'].to(device) # (B, 1, 1, seq_len)
        decoder_mask = batch['decoder_mask'].to(device) # (B, 1, seq_len, seq_len)
        label = batch['label'].to(device) # (B, seq_len)
        # Run the tensors through the encoder, decoder and the projection layer
        proj_output= model.forward(src=encoder_input,tgt=decoder_input,src_mask=encoder_mask,tgt_mask=decoder_mask)
        #encoder_output = model.encode(encoder_input, encoder_mask) # (B, seq_len, d_model)
        #decoder_output = model.decode(encoder_output, encoder_mask, decoder_input, decoder_mask) # (B, seq_len, d_model)
        #proj_output = model.project(decoder_output) # (B, seq_len, vocab_size)

        # Compare the output with the label
       
        #print(f"label: {label.shape}: res: {proj_output.shape}")
        # Compute the loss using a simple cross entropy
        loss = loss_fn(proj_output.view(-1, tokenizer_tgt.get_vocab_size()), label.view(-1))
        batch_iterator.set_postfix({"loss": f"{loss.item():6.3f}"})

        # Log the loss
        writer.add_scalar('train loss', loss.item(), global_step)
        writer.flush()

        # Backpropagate the loss
        loss.backward()

        # Update the weights
        optimizer.step()
        optimizer.zero_grad(set_to_none=True)
        
        global_step += 1
        
    run_validation(model, val_dataloader, tokenizer_src, tokenizer_tgt, config['seq_len'], device, lambda msg: batch_iterator.write(msg), global_step, writer)
    
    # Saving model
    model_filename = get_weights_file_path(config, f'{epoch:02d}')
    # Writting current model state to the 'model_filename'
    torch.save({
        'epoch': epoch, # Current epoch
        'model_state_dict': model.state_dict(),# Current model state
        'optimizer_state_dict': optimizer.state_dict(), # Current optimizer state
        'global_step': global_step # Current global step 
    }, model_filename)
        

```

<div class="output stream stdout">

    Using device: cuda

</div>

<div class="output display_data">

``` json
{"model_id":"549969cd8d3544d4b0e5a731f316ec45","version_major":2,"version_minor":0}
```

</div>

<div class="output stream stderr">

    Downloading data: 100%|██████████| 5.73M/5.73M [00:00<00:00, 20.5MB/s]

</div>

<div class="output display_data">

``` json
{"model_id":"51af7ef42010431f84d8b2cff5d9219f","version_major":2,"version_minor":0}
```

</div>

<div class="output stream stdout">

    Max length of source sentence: 309
    Max length of target sentence: 274
    No model to preload, starting from scratch

</div>

<div class="output stream stderr">

    Processing Epoch 00: 100%|██████████| 910/910 [09:53<00:00,  1.53it/s, loss=5.778]

</div>

<div class="output stream stdout">

    --------------------------------------------------------------------------------
        SOURCE: There must be some misunderstanding!' said Oblonsky.
        TARGET: Qui c’è un equivoco — egli disse.
     PREDICTED: — Non è mai — disse Stepan Arkad ’ ic .
    --------------------------------------------------------------------------------
        SOURCE: I've been bargaining with him for wheat and offering a good price.'
        TARGET: Stavo trattando per il frumento, offrivo dei bei soldi, io.
     PREDICTED: — Io non posso nulla di lui e lo posso un ’ altra .
    --------------------------------------------------------------------------------

</div>

<div class="output stream stderr">

    Processing Epoch 01: 100%|██████████| 910/910 [09:54<00:00,  1.53it/s, loss=5.555]

</div>

<div class="output stream stdout">

    --------------------------------------------------------------------------------
        SOURCE: Once he dined there, and the other time he spent an evening with some visitors, but he had not once stayed the night, as he used to do in former years.
        TARGET: Una volta vi aveva pranzato, un’altra volta aveva passato la serata con ospiti, ma non vi aveva neanche una volta passato la notte, come era solito fare gli anni precedenti.
     PREDICTED: Il giorno , e , e , con un ’ altra cosa , egli aveva fatto che non aveva fatto con un ’ altra cosa , ma egli aveva fatto in modo di non aveva fatto .
    --------------------------------------------------------------------------------
        SOURCE: I now closed Morton school, taking care that the parting should not be barren on my side.
        TARGET: Chiusi la scuola di Morton avendo cura che la separazione, almeno da parte mia, non riuscisse sterile.
     PREDICTED: Io ho detto che non ho detto che la mia vita non mi .
    --------------------------------------------------------------------------------

</div>

<div class="output stream stderr">

    Processing Epoch 02: 100%|██████████| 910/910 [09:54<00:00,  1.53it/s, loss=5.439]

</div>

<div class="output stream stdout">

    --------------------------------------------------------------------------------
        SOURCE: 'And is it true that his wife is here?'
        TARGET: — Ma è vero che la Karenina è qui?
     PREDICTED: — E è vero che la moglie è la moglie ?
    --------------------------------------------------------------------------------
        SOURCE: It was the third year that Oblonsky had been Head of that Government Board in Moscow, and he had won not only the affection but also the respect of his fellow-officials, subordinates, chiefs, and all who had anything to do with him.
        TARGET: Occupando già da tre anni il posto di capo di uno degli uffici amministrativi di Mosca, Stepan Arkad’ic aveva conquistato, oltre la simpatia, la stima dei colleghi, dei dipendenti, dei superiori, e di tutti coloro che avevano a che fare con lui.
     PREDICTED: Era il vecchio principe che Stepan Arkad ’ ic era stato stato stato stato da Mosca , e non solo solo non solo , ma , per lui , per lui , aveva fatto tutto quello che gli aveva fatto tutto quello che gli aveva fatto tutto .
    --------------------------------------------------------------------------------

</div>

<div class="output stream stderr">

    Processing Epoch 03: 100%|██████████| 910/910 [09:54<00:00,  1.53it/s, loss=5.253]

</div>

<div class="output stream stdout">

    --------------------------------------------------------------------------------
        SOURCE: 'Yes we must go away.
        TARGET: — Sì, bisogna partire.
     PREDICTED: — Sì , andiamo .
    --------------------------------------------------------------------------------
        SOURCE: And all at once a strange sensation came over him.
        TARGET: E a un tratto lo afferrò una strana sensazione.
     PREDICTED: E subito subito subito una volta , lo guardò .
    --------------------------------------------------------------------------------

</div>

<div class="output stream stderr">

    Processing Epoch 04: 100%|██████████| 910/910 [09:55<00:00,  1.53it/s, loss=4.306]

</div>

<div class="output stream stdout">

    --------------------------------------------------------------------------------
        SOURCE: You can whistle till you nearly burst your boiler before they will trouble themselves to hurry.
        TARGET: Potete fischiare fino a far scoppiar la caldaia, prima che si scomodino a tirarsi da parte.
     PREDICTED: Voi dovete a voi , prima che prima di prima .
    --------------------------------------------------------------------------------
        SOURCE: He hurried downstairs feeling that he must do something, he knew not what.
        TARGET: Andò giù a passi svelti: sentiva di dover agire, ma non sapeva come.
     PREDICTED: Egli si avvicinò che cosa si qualcosa , non sapeva cosa .
    --------------------------------------------------------------------------------

</div>

<div class="output stream stderr">

    Processing Epoch 05: 100%|██████████| 910/910 [09:55<00:00,  1.53it/s, loss=4.843]

</div>

<div class="output stream stdout">

    --------------------------------------------------------------------------------
        SOURCE: "Who are you?" looking at me with surprise and a sort of alarm, but still not wildly.
        TARGET: Poi mi fissò con uno sguardo meravigliato, sgomento, ma non smarrito.
     PREDICTED: — Chi siete ? — mi domandò con un ' espressione di un ' altra , ma non mi .
    --------------------------------------------------------------------------------
        SOURCE: 'Call it what you like,' said the Cat. 'Do you play croquet with the Queen to-day?'
        TARGET: — Di' come ti pare, — rispose il Gatto. — Vai oggi dalla Regina a giocare a croquet?
     PREDICTED: — E che cosa avete detto — disse il Gatto . — Vi prego di Regina con la Regina ?
    --------------------------------------------------------------------------------

</div>

<div class="output stream stderr">

    Processing Epoch 06: 100%|██████████| 910/910 [09:54<00:00,  1.53it/s, loss=4.623]

</div>

<div class="output stream stdout">

    --------------------------------------------------------------------------------
        SOURCE: 'What are you talking about?' asked Oblonsky, entering the room from his study and addressing his wife.
        TARGET: — Che c’è — chiese Stepan Arkad’ic, venendo fuori dallo studio e rivolgendosi alla moglie.
     PREDICTED: — Che cosa avete mai di parlare ? — chiese Stepan Arkad ’ ic , indicando la moglie e , la moglie .
    --------------------------------------------------------------------------------
        SOURCE: Therefore, the duke erred in his choice, and it was the cause of his ultimate ruin.
        TARGET: Errò, adunque, el duca in questa elezione; e fu cagione dell'ultima ruina sua.
     PREDICTED: E , adunque , nel suo stato , e fu la sua attenzione , fu la sua attenzione .
    --------------------------------------------------------------------------------

</div>

<div class="output stream stderr">

    Processing Epoch 07: 100%|██████████| 910/910 [09:54<00:00,  1.53it/s, loss=4.264]

</div>

<div class="output stream stdout">

    --------------------------------------------------------------------------------
        SOURCE: He was not feeling at all tired and was only longing to work again and to accomplish as much as he could.
        TARGET: Non sentiva più nessuna stanchezza; voleva solo lavorare sempre più svelto e sempre di più.
     PREDICTED: Non era neppure in nessun modo che si era e non solo per , e non poteva non poté .
    --------------------------------------------------------------------------------
        SOURCE: 'Why, he's jealous!' she thought. 'Oh dear!
        TARGET: “Perché è geloso — ella pensava. — Dio mio! com’è simpatico e sciocco!
     PREDICTED: “ Perché è proprio così !” pensava . — Ah , cara !
    --------------------------------------------------------------------------------

</div>

<div class="output stream stderr">

    Processing Epoch 08: 100%|██████████| 910/910 [09:54<00:00,  1.53it/s, loss=3.757]

</div>

<div class="output stream stdout">

    --------------------------------------------------------------------------------
        SOURCE: Two feet off, you dimly observe a half-dressed ruffian, waiting to kill you, and you are preparing for a life-and-death struggle with him, when it begins to dawn upon you that it's Jim.
        TARGET: Un paio di metri lontano, scorgete oscuramente un brigante seminudo che aspetta per ammazzarvi, e vi preparate per una lotta a sangue, quando comincia a balenarvi in niente che sia l’amico Gianni.
     PREDICTED: Due piedi , a metà della metà della metà della metà della metà , vi e vi per un po ’ di morte , quando lo con la morte , vi che vi .
    --------------------------------------------------------------------------------
        SOURCE: The horse was not yet ready, but feeling particularly energetic, physically strong and alert to meet what lay before him, so as not to lose a moment he did not wait for it but started off on foot, telling Kuzma to catch him up.
        TARGET: Il cavallo non era ancora pronto, ma, sentendo in sé un particolare tendersi delle forze fisiche e dell’attenzione verso quello che bisognava fare, per non perdere neanche un minuto, senza aspettare il cavallo, uscì a piedi e ordinò a Kuz’ma di raggiungerlo.
     PREDICTED: Il cavallo non era ancora pronta , ma , in particolare , e , , si a quello che non voleva , non si , ma che non si avvicinava , si , si avvicinò alla gamba , e si mise a .
    --------------------------------------------------------------------------------

</div>

<div class="output stream stderr">

    Processing Epoch 09: 100%|██████████| 910/910 [09:54<00:00,  1.53it/s, loss=3.632]

</div>

<div class="output stream stdout">

    --------------------------------------------------------------------------------
        SOURCE: It had lost half its tail, one of its ears, and a fairly appreciable proportion of its nose.
        TARGET: Aveva perduto la coda, un orecchio, e una parte del naso.
     PREDICTED: Era il suo dolore , una di , e un di di .
    --------------------------------------------------------------------------------
        SOURCE: But Serezha, though he heard his tutor's weak voice, paid no heed to it.
        TARGET: Ma Serëza, pur avendo sentito la voce fiacca dell’istitutore, non vi fece attenzione.
     PREDICTED: Ma Serëza , pur senza sentire la voce di Serëza , non aveva nessuna voce di .
    --------------------------------------------------------------------------------

</div>

<div class="output stream stderr">

    Processing Epoch 10: 100%|██████████| 910/910 [09:54<00:00,  1.53it/s, loss=4.139]

</div>

<div class="output stream stdout">

    --------------------------------------------------------------------------------
        SOURCE: "The carrier, no doubt," I thought, and ran downstairs without inquiry.
        TARGET: — Il vetturino, — pensai, e scesi subito.
     PREDICTED: — Il pensiero non è vero , — pensavo , — e senza riflettere .
    --------------------------------------------------------------------------------
        SOURCE: "Do you, sir, feel calm and happy?"
        TARGET: — Signore, vi sentite calmo e felice?
     PREDICTED: — Volete bene , signore ?
    --------------------------------------------------------------------------------

</div>

<div class="output stream stderr">

    Processing Epoch 11: 100%|██████████| 910/910 [09:54<00:00,  1.53it/s, loss=3.464]

</div>

<div class="output stream stdout">

    --------------------------------------------------------------------------------
        SOURCE: However, his father did not make him repeat it, but went on to the lesson from the Old Testament.
        TARGET: Ma il padre non lo costrinse a ripetere e passò alla lezione sull’Antico Testamento.
     PREDICTED: Ma il padre non lo disse , ma andò da .
    --------------------------------------------------------------------------------
        SOURCE: CHAPTER VIII
        TARGET: VIII
     PREDICTED: VIII
    --------------------------------------------------------------------------------

</div>

<div class="output stream stderr">

    Processing Epoch 12: 100%|██████████| 910/910 [09:54<00:00,  1.53it/s, loss=3.671]

</div>

<div class="output stream stdout">

    --------------------------------------------------------------------------------
        SOURCE: Supposing you came to dinner to-day?
        TARGET: Magari oggi a pranzo.
     PREDICTED: Mettiamo oggi oggi oggi ?
    --------------------------------------------------------------------------------
        SOURCE: 'Why, he's jealous!' she thought. 'Oh dear!
        TARGET: “Perché è geloso — ella pensava. — Dio mio! com’è simpatico e sciocco!
     PREDICTED: “ Ma lui è un ’ altra cosa !” ella pensava . — Ah , Dio mio , Dio mio , Dio mio , che fa bene !
    --------------------------------------------------------------------------------

</div>

<div class="output stream stderr">

    Processing Epoch 13: 100%|██████████| 910/910 [09:54<00:00,  1.53it/s, loss=3.499]

</div>

<div class="output stream stdout">

    --------------------------------------------------------------------------------
        SOURCE: 'What can I write?' she thought. 'What can I decide alone?
        TARGET: «Che posso scrivere? — pensava. — Che posso decidere da sola?
     PREDICTED: “ Che cosa posso scrivere ?” pensava . — Che cosa posso mai io ?
    --------------------------------------------------------------------------------
        SOURCE: Of that he was firmly convinced, and had long been so – ever since he had begun painting it; yet the opinion of others, whoever they might be, seemed to him of great importance, and disturbed him to the depths of his soul.
        TARGET: Questo lo sapeva fermamente e lo sapeva da gran tempo, da quando aveva cominciato a dipingerlo; ma i giudizi degli altri, quali che fossero, avevano tuttavia per lui un’importanza enorme e lo agitavano fino in fondo all’anima.
     PREDICTED: S ’ egli era fermamente convinto che , ed era stata mai stata da tanto tempo , egli era ancora convinto di aver avuto l ’ opinione pubblica , e gli sembrava di essere di questa conoscenza di un grande importanza , l ’ importanza dell ’ anima lo amava .
    --------------------------------------------------------------------------------

</div>

<div class="output stream stderr">

    Processing Epoch 14: 100%|██████████| 910/910 [09:54<00:00,  1.53it/s, loss=3.405]

</div>

<div class="output stream stdout">

    --------------------------------------------------------------------------------
        SOURCE: And it was after long searching that I found out the carpenter’s chest, which was, indeed, a very useful prize to me, and much more valuable than a shipload of gold would have been at that time.
        TARGET: Di fatto dopo lunghe ricerche trovai la cassa del carpentiere più preziosa all’uso mio in quel momento, che nol sarebbe stato un galeone carico d’oro.
     PREDICTED: E dopo che mi la pelle , trovai fuori dal petto , che da una specie di era una specie di , che mi avrebbe trovato un di , molto tempo di una specie di .
    --------------------------------------------------------------------------------
        SOURCE: Mr. Rochester held the candle over him; I recognised in his pale and seemingly lifeless face--the stranger, Mason: I saw too that his linen on one side, and one arm, was almost soaked in blood.
        TARGET: Il signor Rochester avvicinò la candela e in quella testa pallida e inanimata riconobbi il signor Mason. Vidi che gli asciugamani che gli coprivano un braccio e un fianco erano intrisi di sangue.
     PREDICTED: Il signor Rochester lo vidi dietro a quella candela , e mi misi a pronunziare il volto pallido e a Mason , vidi il signor Mason e vidi una sola volta sul suo sangue .
    --------------------------------------------------------------------------------

</div>

<div class="output stream stderr">

    Processing Epoch 15: 100%|██████████| 910/910 [09:54<00:00,  1.53it/s, loss=2.900]

</div>

<div class="output stream stdout">

    --------------------------------------------------------------------------------
        SOURCE: These he read in the ante-room, so as not to let them divert his attention later on.
        TARGET: Levin, proprio lì in anticamera, per non dimenticarsene poi, le lesse.
     PREDICTED: Questi venne in anticamera , in salotto non la sua attenzione , e poi tornò in silenzio .
    --------------------------------------------------------------------------------
        SOURCE: On that side!' she said irritably to Varenka, who was not wrapping the plaid round her feet the right way.
        TARGET: Dall’altra parte! — disse con stizza a Varen’ka che le avvolgeva le gambe nello scialle non precisamente come voleva lei.
     PREDICTED: che , fianco , non era al Varen ’ ka che , non era con gli zoccoli , si voltò a destra e destra .
    --------------------------------------------------------------------------------

</div>

<div class="output stream stderr">

    Processing Epoch 16: 100%|██████████| 910/910 [09:55<00:00,  1.53it/s, loss=3.443]

</div>

<div class="output stream stdout">

    --------------------------------------------------------------------------------
        SOURCE: Karenin was going to mention the bill that had been brought him, but his voice shook and he paused.
        TARGET: — Aleksej Aleksandrovic voleva dire del conto che gli avevano portato, ma la voce cominciò a tremare ed egli si fermò.
     PREDICTED: Aleksej Aleksandrovic voleva dire che il suo conto era stato portato la voce , ma egli si scosse e tacque .
    --------------------------------------------------------------------------------
        SOURCE: With noiseless steps she advanced toward the bedside, went round so that he need not turn his head, and at once grasping his enormous skeleton hand with her fresh young one, pressed it, and with that sympathetic, quiet animation which gives no offence and is natural only to women, she began to talk to him.
        TARGET: A passi leggeri si avvicinò svelta al lettuccio del malato e, accostandosi in modo che egli non avesse da voltare il capo, prese subito nella sua mano fresca, giovane, lo scheletro enorme della mano di lui, la strinse e, con quella sommessa animazione compassionevole, ma non offensiva, propria solo delle donne, cominciò a parlare con lui.
     PREDICTED: Con la solita piccola costituzione verso il letto , andò a voltarsi verso il capo , e poi , , non si mise a ridere con la testa in testa , e con la testa , , e con un giovane , che , senza volere si , cominciò a parlare di non altro che ella cominciò a parlare .
    --------------------------------------------------------------------------------

</div>

<div class="output stream stderr">

    Processing Epoch 17: 100%|██████████| 910/910 [09:55<00:00,  1.53it/s, loss=3.357]

</div>

<div class="output stream stdout">

    --------------------------------------------------------------------------------
        SOURCE: He lifted his hand and opened his eyelids; gazed blank, and with a straining effort, on the sky, and toward the amphitheatre of trees: one saw that all to him was void darkness.
        TARGET: Si fermò, non sapendo da qual lato volgere, stese la mano, sollevò le palpebre, guardò intorno a sé e facendo uno sforzo diresse gli occhi verso gli alberi e il cielo.
     PREDICTED: Sollevò la mano e aprì il braccio , e , con uno sforzo per guardare il cielo , lo vide verso gli alberi , e vide che il cielo era buio .
    --------------------------------------------------------------------------------
        SOURCE: 'Yes,' said Alice doubtfully: 'it means--to--make--anything--prettier.'
        TARGET: — Sì, — rispose Alice, ma un po' incerta: — significa... rendere... qualche cosa... più bella.
     PREDICTED: — Sì , — disse Alice ; — per fare qualche cosa , fare il , tutto è vero .
    --------------------------------------------------------------------------------

</div>

<div class="output stream stderr">

    Processing Epoch 18: 100%|██████████| 910/910 [09:55<00:00,  1.53it/s, loss=3.196]

</div>

<div class="output stream stdout">

    --------------------------------------------------------------------------------
        SOURCE: And she was surprised that formerly this had seemed impossible to her, and laughingly explained to them how much simpler it really was, and that they were both now contented and happy.
        TARGET: Ed ella stupiva come questo le fosse apparso prima impossibile, e spiegava loro, ridendo, che era molto più semplice, e che ora entrambi erano felici e contenti.
     PREDICTED: E si accorse che quest ’ ora non si fosse possibile a lei e che , per quanto fosse colpevole , si trattava di loro e di quanto si felice , e tutti e due erano felici .
    --------------------------------------------------------------------------------
        SOURCE: These eyes in the Evening Star you must have seen in a dream.
        TARGET: gli occhi di questa "Stella Vespertina" avete dovuto vederli in sogno.
     PREDICTED: Questi occhi , se siete stata l ’ aria un sogno .
    --------------------------------------------------------------------------------

</div>

<div class="output stream stderr">

    Processing Epoch 19: 100%|██████████| 910/910 [09:55<00:00,  1.53it/s, loss=2.762]

</div>

<div class="output stream stdout">

    --------------------------------------------------------------------------------
        SOURCE: "It would be so much better," she said, "if she could only get out of the way for a month or two, till all was over."
        TARGET: "Sarebbe meglio per me, — diceva, — che me ne andassi per un mese o due finché tutto non sarà finito."
     PREDICTED: — Sarebbe meglio , — disse , — se si fosse possibile soltanto due o tre giorni .
    --------------------------------------------------------------------------------
        SOURCE: Mama!' When he reached her he clung round her neck.
        TARGET: Giunto di corsa fino a lei, le si appese al collo.
     PREDICTED: Mamma alla fine , egli la prese a guardare intorno a sé .
    --------------------------------------------------------------------------------

</div>

<div class="output stream stderr">

    Processing Epoch 20: 100%|██████████| 910/910 [09:54<00:00,  1.53it/s, loss=2.944]

</div>

<div class="output stream stdout">

    --------------------------------------------------------------------------------
        SOURCE: Koznyshev was talking to Dolly, jokingly assuring her that the custom of going away after the wedding was spreading because newly-married couples always felt rather uncomfortable.
        TARGET: Sergej Ivanovic parlava con Dar’ja Dmitrievna, sostenendo per scherzo che l’usanza di partire dopo il matrimonio è diffusa perché gli sposi novelli si vergognano sempre un poco.
     PREDICTED: Sergej Ivanovic voleva parlare di Dar ’ ja Aleksandrovna , che le si l ’ abito un matrimonio , il matrimonio di quel matrimonio per il matrimonio .
    --------------------------------------------------------------------------------
        SOURCE: This afternoon, instead of dreaming of Deepden, I was wondering how a man who wished to do right could act so unjustly and unwisely as Charles the First sometimes did; and I thought what a pity it was that, with his integrity and conscientiousness, he could see no farther than the prerogatives of the crown.
        TARGET: Invece di sognare il mio paese, ero meravigliata che un uomo che amava il bene potesse commettere tante ingiustizie e pazzie, come quel Carlo I. Pensavo che è triste con quella integrità e quella coscienza di non ammetter nulla all'infuori dell'autorità.
     PREDICTED: Il pomeriggio di un pomeriggio di , fui chiesto come io potevo un uomo di , e mi pareva che la voglia dovesse fare ogni momento che non facesse più , e mi parve un ' onda che la testa non potesse veder più la sua attenzione .
    --------------------------------------------------------------------------------

</div>

<div class="output stream stderr">

    Processing Epoch 21: 100%|██████████| 910/910 [09:54<00:00,  1.53it/s, loss=2.602]

</div>

<div class="output stream stdout">

    --------------------------------------------------------------------------------
        SOURCE: The soldiers were silent, and looked at Alice, as the question was evidently meant for her.
        TARGET: I soldati tacevano e guardavano Alice, pensando che la domanda fosse rivolta a lei.
     PREDICTED: La soldati tacque , e Alice guardò ansiosamente come se la domanda evidentemente .
    --------------------------------------------------------------------------------
        SOURCE: All that evening Dolly maintained her usual slightly bantering manner toward her husband, and Oblonsky was contented and cheerful, but not to the extent of seeming to forget his guilt after having obtained forgiveness.
        TARGET: Tutta la serata Dolly fu, come al solito, leggermente canzonatoria col marito, e Stepan Arkad’ic contento e allegro, ma non tanto da apparire, dopo il perdono, dimentico della propria colpa.
     PREDICTED: Tutta quella sera , Dolly le sue forze verso la sua abituale , verso il tono canzonatorio , Stepan Arkad ’ ic era allegro e allegro che non e non cessava di , ma dopo il suo perdono .
    --------------------------------------------------------------------------------

</div>

<div class="output stream stderr">

    Processing Epoch 22: 100%|██████████| 910/910 [09:54<00:00,  1.53it/s, loss=2.589]

</div>

<div class="output stream stdout">

    --------------------------------------------------------------------------------
        SOURCE: The landowner looked at him.
        TARGET: Il proprietario lo guardò.
     PREDICTED: Il proprietario gli guardò .
    --------------------------------------------------------------------------------
        SOURCE: Even down to small details Koznyshev found in her all that he desired in a wife: she was poor and solitary, so that she would not bring into her husband's house a crowd of relations and their influence, as he saw Kitty doing. She would be indebted to her husband for everything, which was a thing he had always desired in his future family life.
        TARGET: Perfino nei particolari Sergej Ivanovic trovava in lei tutto quello che avrebbe desiderato in una moglie: era povera e sola, sicché non avrebbe portato con sé un nugolo di parenti e la loro influenza in casa del marito, come egli vedeva nel caso di Kitty; ma avrebbe dovuto tutto al marito, cosa ch’egli aveva sempre desiderato per la propria futura vita familiare.
     PREDICTED: E , per andare a Sergej Ivanovic , trovava tutto quello che aveva , nei momenti penosi , e nella mente era così poco : nel marito , non avrebbe parlato a una casa , e i rapporti con i parenti e i parenti della signora Stahl , vedeva una cosa che , invece , era sempre , tuttavia nelle sue supposizioni della sua vita , sempre qualcosa di contrario .
    --------------------------------------------------------------------------------

</div>

<div class="output stream stderr">

    Processing Epoch 23: 100%|██████████| 910/910 [09:54<00:00,  1.53it/s, loss=2.687]

</div>

<div class="output stream stdout">

    --------------------------------------------------------------------------------
        SOURCE: 'You have only taken an idea from others, and distorted it, and you wish to apply it where it is inapplicable.'
        TARGET: — Tu hai preso soltanto un’idea non tua, poi l’hai fatta diventar mostruosa e vuoi applicarla all’inapplicabile.
     PREDICTED: — Tu hai ricevuto un ’ idea dall ’ idea e gli altri lo desideri e desideri , e vuoi .
    --------------------------------------------------------------------------------
        SOURCE: He was really dissatisfied, not because they had spent so much but because he had been reminded of a matter which, well knowing that something was wrong, he wished to forget.
        TARGET: Realmente egli era contrariato, non che se ne andassero molti denari, ma che gli si ricordasse quello che lui, sapendo che v’era qualcosa che non andava, voleva dimenticare.
     PREDICTED: Era davvero disteso , non perché avevano passato tanto bene quanto era stato d ’ animo ; e sapendo che qualche cosa di sapere bene non voleva bene a nulla .
    --------------------------------------------------------------------------------

</div>

<div class="output stream stderr">

    Processing Epoch 24: 100%|██████████| 910/910 [09:54<00:00,  1.53it/s, loss=2.881]

</div>

<div class="output stream stdout">

    --------------------------------------------------------------------------------
        SOURCE: Now, what do you think?
        TARGET: Dimmi, come credi tu?
     PREDICTED: Ma , adesso , cosa pensi ?
    --------------------------------------------------------------------------------
        SOURCE: The order was given: 'Mount!'
        TARGET: Poi si udì: «in sella!».
     PREDICTED: L ' ordine era data .
    --------------------------------------------------------------------------------

</div>

</div>
