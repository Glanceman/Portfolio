

## Install script

### 1. Setup master node

``` curl -sfL https://get.k3s.io | sh -```
1.  **`curl -sfL https://get.k3s.io`**:
    
    -   `curl`: This is a command-line tool used to transfer data from or to a server using various protocols (HTTP, HTTPS, FTP, etc.).
    -   `-sfL`: These are options passed to  `curl`:
        -   `-s`: Silent mode. It suppresses progress and error messages.
        -   `-f`: Fail silently on server errors (e.g., HTTP 404).
        -   `-L`: Follow redirects. If the server responds with a redirect (HTTP 3xx),  `curl`  will automatically follow it.
    -   `https://get.k3s.io`: This is the URL from which data will be fetched using  `curl`. In this case, it’s the script for installing K3s, a lightweight Kubernetes distribution.
2.  **`| sh -`**:
    
    -   The  `|`  (pipe) symbol connects the output of the previous command (`curl`) to the input of the next command (`sh`).
    -   `sh`: This is the shell interpreter (usually Bash or another shell). It reads and executes commands from the standard input (in this case, the output of  `curl`).
    -   So, the entire command sequence fetches the K3s installation script from the specified URL and pipes it to the shell (`sh`) for execution.

### 2. Setup Agent node
```curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="agent --server https://k3s.example.com --token mypassword" sh -s -```

---
##  Useful Commands

### Node and Pod

**List all nodes:**
``` kubectl get node```

**List all Pod**
``` kubectl get pod```

**Check Token (Default)**
Server : ``` cat /var/lib/rancher/k3s/server/token```
Agent : ``` cat /var/lib/rancher/k3s/server/agent-token```

**Change Hostname**
```hostnamectl set-hostname master```

**Create Pod**
`kubectl run <podname> --image=<image name>`

**Check Pods**
1. ```kubectl logs -f <pod name>```
2. ```kubectl describe pod <pod name>```
3. ```kubectl get pod -owide```

**Restart K3s**
```sudo systemctl restart k3s```

**Detele Node**
```kubectl delete node <name>```

**Detele Pod**
```kubectl delete pod mynginx ```

**Stop Master node**
``/usr/local/bin/k3s-killall.sh``

**Execute command though pod**
```kubectl exec -it <pod name> -- <command>```
-   `kubectl exec`: This command allows you to execute commands inside a container running in a Kubernetes Pod.
-   `-it`: These are optional flags:
    -   `-i`: Enables interactive mode, allowing you to interact with the container.
    -   `-t`: Allocates a pseudo-TTY (terminal) for the session.
-   `mynginx`: This is the name of the Pod containing the container where you want to execute commands.
-   `--`: This separator indicates that all subsequent arguments are part of the command to execute inside the container.
-   `/bin/bash`: This is the command you want to run inside the container. In this case, it opens a Bash shell session connected to the specified container

**Temporay pod**
``kubectl run <pod name> --image=busybox -it --rm``

---
### Deployment
**Create deployment**
>`kubectl create deployment <deployment name> --image=<image name> --replicas=3`

**Check deployment**
>`kubectl get deploy`

```
ubuntu@ip-172-31-85-60:~$ sudo kubectl get pod
NAME                         READY   STATUS    RESTARTS   AGE
my-deploy-858cc58b7d-gqfn4   1/1     Running   0          23s
my-deploy-858cc58b7d-v6m9g   1/1     Running   0          23s
my-deploy-858cc58b7d-2w6d2   1/1     Running   0          23s
my-deploy-ReplicateSet-2w6d2   1/1     Running   0          23s
```

**Check ReplicateSet**
>`kubectl get replicaSet`
```{linux}
ubuntu@ip-172-31-85-60:~$ sudo kubectl get replicaSet
NAME                   DESIRED   CURRENT   READY   AGE
my-deploy-858cc58b7d   3         3         3       2m36s
```
**Rescale Replicants**
1. >`sudo kubectl scale deploy <deploy name> --replicas=5`
2. > `kubectl autoscale deployment/<deploy name> --min=3 --max=10 --cpu-perccent=75`
```
ubuntu@ip-172-31-85-60:~$ sudo kubectl get replicaSet --watch
NAME                   DESIRED   CURRENT   READY   AGE
my-deploy-858cc58b7d   3         3         3       7m21s
my-deploy-858cc58b7d   5         3         3       9m14s
my-deploy-858cc58b7d   5         3         3       9m14s
my-deploy-858cc58b7d   5         5         3       9m14s
my-deploy-858cc58b7d   5         5         4       9m16s
my-deploy-858cc58b7d   5         5         5       9m17s
```

**Update Image**
>`kubectl set image deploy/<deployment> <container name>=<image name>`
```
ubuntu@ip-172-31-85-60:~$ sudo kubectl get deploy -owide
NAME        READY   UP-TO-DATE   AVAILABLE   AGE   CONTAINERS   IMAGES       SELECTOR
my-deploy   2/2     2            2           15m   nginx        nginx:1.22   app=my-deploy

ubuntu@Master:~$ sudo kubectl get replicaSet --watch
NAME                   DESIRED   CURRENT   READY   AGE
my-deploy-858cc58b7d   2         2         2       18m
my-deploy-8c67c584c    1         0         0       0s
my-deploy-8c67c584c    1         0         0       0s
my-deploy-8c67c584c    1         1         0       0s
my-deploy-8c67c584c    1         1         1       6s
my-deploy-858cc58b7d   1         2         2       19m
my-deploy-8c67c584c    2         1         1       6s
my-deploy-858cc58b7d   1         2         2       19m
my-deploy-8c67c584c    2         1         1       6s
my-deploy-858cc58b7d   1         1         1       19m
my-deploy-8c67c584c    2         2         1       6s
my-deploy-8c67c584c    2         2         2       15s
my-deploy-858cc58b7d   0         1         1       19m
my-deploy-858cc58b7d   0         1         1       19m
my-deploy-858cc58b7d   0         0         0       19m
```
**Check deploy history**
>`sudo kubectl rollout history deploy/<deploy name> `
```
ubuntu@ip-172-31-85-60:~$ sudo kubectl rollout history deploy/my-deploy 
deployment.apps/my-deploy 
REVISION  CHANGE-CAUSE
1         <none>
2         <none>

ubuntu@ip-172-31-85-60:~$ sudo kubectl rollout history deploy/my-deploy --revision=1
deployment.apps/my-deploy with revision #1
Pod Template:
  Labels:       app=my-deploy
        pod-template-hash=858cc58b7d
  Containers:
   nginx:
    Image:      nginx:1.22
    Port:       <none>
    Host Port:  <none>
    Environment:        <none>
    Mounts:     <none>
  Volumes:      <none>
```
**Revert back**
>`sudo kubectl rollout undo deploy/<deploy name> --to-revision=1`
```
^Cubuntu@Master:~$ sudo kubectl get replicaSet --watch
NAME                   DESIRED   CURRENT   READY   AGE
my-deploy-8c67c584c    2         2         2       6m49s
my-deploy-858cc58b7d   0         0         0       25m
my-deploy-858cc58b7d   0         0         0       26m
my-deploy-858cc58b7d   1         0         0       26m
my-deploy-858cc58b7d   1         0         0       26m
my-deploy-858cc58b7d   1         1         0       26m
my-deploy-858cc58b7d   1         1         1       26m
my-deploy-8c67c584c    1         2         2       7m18s
my-deploy-858cc58b7d   2         1         1       26m
my-deploy-8c67c584c    1         2         2       7m18s
my-deploy-8c67c584c    1         1         1       7m18s
my-deploy-858cc58b7d   2         1         1       26m
my-deploy-858cc58b7d   2         2         1       26m
my-deploy-858cc58b7d   2         2         2       26m
my-deploy-8c67c584c    0         1         1       7m20s
my-deploy-8c67c584c    0         1         1       7m21s
my-deploy-8c67c584c    0         0         0       7m21s

^Cubuntu@Master:~$ sudo kubectl get replicaSet 
NAME                   DESIRED   CURRENT   READY   AGE
my-deploy-858cc58b7d   2         2         2       27m
my-deploy-8c67c584c    0         0         0       8m14s

<pod>
ubuntu@Master:~$ sudo kubectl get pod 
NAME                         READY   STATUS    RESTARTS   AGE
my-deploy-858cc58b7d-n6xwv   1/1     Running   0          75s
my-deploy-858cc58b7d-m8w67   1/1     Running   0          74s

```

___
### Service

**Expose port**
> `kubectl expose deploy/<deploy name> --name=<service name> --port=<public port number> --target-port=<container port number>`

ServiceType
> **ClusterIP** : service will be publics among cluster. A static inner IP will be given.
>  1. Through Pod: < Service name > : < port number>
>  2. Though Cluster : IP : < port number>

>**NodePort** : Outsider can visit though nodeIP and NodePort
> `sudo kubectl expose deploy/my-deploy --name=nginx-outside --port=8081 --target-port=80 --type=NodePort`

```
----before---
NAME                 TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE
service/kubernetes   ClusterIP   10.43.0.1    <none>        443/TCP   120m

---After---
ubuntu@ip-172-31-85-60:~$ sudo kubectl get service
NAME            TYPE        CLUSTER-IP    EXTERNAL-IP   PORT(S)    AGE
kubernetes      ClusterIP   10.43.0.1     <none>        443/TCP    125m
nginx-service   ClusterIP   10.43.58.30   <none>        8080/TCP   2m57s <----

ubuntu@ip-172-31-85-60:~$ curl 10.43.58.30:8080
<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
<style>....

ubuntu@ip-172-31-85-60:~$ sudo kubectl describe service nginx-service
Name:              nginx-service
Namespace:         default
Labels:            app=my-deploy
Annotations:       <none>
Selector:          app=my-deploy
Type:              ClusterIP
IP Family Policy:  SingleStack
IP Families:       IPv4
IP:                10.43.58.30
IPs:               10.43.58.30
Port:              <unset>  8080/TCP
TargetPort:        80/TCP
Endpoints:         10.42.0.10:80,10.42.2.10:80 <- load balancing
Session Affinity:  None
Events:            <none>
```

---
### Namespace
>kubectl get namespace
```
ubuntu@ip-172-31-85-60:~$ sudo kubectl get namespace
NAME              STATUS   AGE
kube-system       Active   145m
kube-public       Active   145m
kube-node-lease   Active   145m
default           Active   145m
```

```
ubuntu@ip-172-31-85-60:~$ sudo kubectl get pod -A
NAMESPACE     NAME                                      READY   STATUS    RESTARTS   AGE
kube-system   svclb-traefik-888d36d7-jntcw              2/2     Running   0          120m
kube-system   local-path-provisioner-84db5d44d9-kw5gs   1/1     Running   0          117m
kube-system   coredns-6799fbcd5-qnkxl                   1/1     Running   0          117m
kube-system   traefik-f4564c4f4-qrnwr                   1/1     Running   0          117m
kube-system   svclb-traefik-888d36d7-dfhl7              2/2     Running   0          81m
kube-system   metrics-server-67c658944b-njqkf           1/1     Running   0          117m
default       my-deploy-858cc58b7d-n6xwv                1/1     Running   0          28m
default       my-deploy-858cc58b7d-m8w67                1/1     Running   0          28m
ubuntu@ip-172-31-85-60:~$ 
```
```
ubuntu@ip-172-31-85-60:~$ sudo kubectl get lease -A
NAMESPACE         NAME                                   HOLDER                                                                      AGE
kube-node-lease   master                                 master                                                                      121m
kube-node-lease   agent                                  agent                                                                       82m
kube-system       apiserver-cgz6cgqn3uwazzadxar7pysjo4   apiserver-cgz6cgqn3uwazzadxar7pysjo4_2ddf4fb7-66b8-41fa-8a2a-b08997b13e4b   121m
```

**Create Namespace**
>`kubectl create namespace <name>`
```
ubuntu@ip-172-31-85-60:~$ sudo kubectl create namespace develop
namespace/develop created
ubuntu@ip-172-31-85-60:~$ sudo kubectl get namespace -A
NAME              STATUS   AGE
kube-system       Active   149m
kube-public       Active   149m
kube-node-lease   Active   149m
default           Active   149m
develop           Active   15s
```

**Set Default namespace**
>`kubectl config set-context $(kubectl config current-context) --namespace=<namespace>`

**Delete all object under same namespace**
>`kubectl delete ns < namespace >`

___
### Images

**Check container**
>`crictl ps`

```
ubuntu@ip-172-31-85-60:~$ sudo crictl ps
CONTAINER           IMAGE               CREATED             STATE               NAME                     ATTEMPT             POD ID              POD
4f3d170bc6e09       0f8498f13f3ad       53 minutes ago      Running             nginx                    0                   f1e6d992be283       my-deploy-858cc58b7d-m8w67
80c1a9e4ad852       cc365cbb0397b       2 hours ago         Running             traefik                  0                   fe68433795eaf       traefik-f4564c4f4-qrnwr
96f5afda78943       b29384aeb4b13       2 hours ago         Running             local-path-provisioner   0                   62ecb8f321fd2       local-path-provisioner-84db5d44d9-kw5gs
b42b07e9ad509       ead0a4a53df89       2 hours ago         Running             coredns                  0                   79d3753d3534c       coredns-6799fbcd5-qnkxl
59b123c68d8de       817bbe3f2e517       2 hours ago         Running             metrics-server           0                   5b2d97d3448ef       metrics-server-67c658944b-njqkf
bf3b794f3dad7       17066c233afa3       2 hours ago         Running             lb-tcp-443               0                   0158a94c7a77e       svclb-traefik-888d36d7-jntcw
2060075105a02       17066c233afa3       2 hours ago         Running             lb-tcp-80                0                   0158a94c7a77e       svclb-traefik-888d36d7-jntcw
```

**Check images**
>`crictl images`
```
ubuntu@ip-172-31-85-60:~$ sudo crictl images
IMAGE                                        TAG                    IMAGE ID            SIZE
docker.io/library/nginx                      1.22                   0f8498f13f3ad       57MB
docker.io/library/nginx                      1.23                   a7be6198544f0       57MB
docker.io/rancher/klipper-helm               v0.8.2-build20230815   5f89cb8137ccb       90.9MB
docker.io/rancher/klipper-lb                 v0.4.5                 17066c233afa3       7.82MB
docker.io/rancher/local-path-provisioner     v0.0.24                b29384aeb4b13       14.9MB
docker.io/rancher/mirrored-coredns-coredns   1.10.1                 ead0a4a53df89       16.2MB
docker.io/rancher/mirrored-library-traefik   2.10.5                 cc365cbb0397b       43.1MB
docker.io/rancher/mirrored-metrics-server    v0.6.3                 817bbe3f2e517       29.9MB
docker.io/rancher/mirrored-pause             3.6                    6270bb605e12e       301kB
```

**Import docker image**
> `ctr -n k8s.io images import "path" --platform linux/amd64`

**Export image from containerd**
>`ctr -n k8s.io image export <tagetpath> <image name> --platform linux/amd64`
