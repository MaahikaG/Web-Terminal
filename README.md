# Web-Terminal

## Description
These web terminals are supposed to be integrated into the VersionWise application. Their purpose is to allow users to learn about Git commands without impacting their local machine. The terminal will be accompanied by lessons teaching the users about version control software, and a chatbot to give the user tailored feedback. More information can be found in the README.md file of the Version-Wise repository.
The client and server in this repository were built by modifying the code in Sai Sandeep Vaddi's how-to-create-web-terminals GitHub repository.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [CI/CD](#ci/cd)

## Installation
The Kubernetes Web Terminal is still in its production stage, so these are just the installation steps to get to the current MVP.
- Install MicroK8s
  - Using Homebrew
    ``` 
    brew install ubuntu/microk8s/microk8s
    microk8s install
    microk8s status --wait-ready
    microk8s enable dashboard dns registry istio
    alias kubectl='microk8s kubectl'
    KUBECONFIG=$KUBECONFIG:~/.kube/config:~/.kube/config-microk8s
    export KUBECONFIG
    export KUBECONFIG=/var/snap/microk8s/current/credentials/client.config
    kubectl config use-context microk8s
    kubectl get nodes
    ```
- Check if you are using MicroK8s. 
   ``` kubectl config current-context ``` should return microk8s
- Enable an external GitHub Container Registry to store your images
  - Create a new classic personal access token on GitHub, and select the read:packages, write:packages, and delete:packages options
  - In your terminal, save your token as an environment variable using ```export CR_PAT=YOUR_TOKEN```
  - Log into ghcr.io using your GitHub username: ```echo $CR_PAT | docker login ghcr.io -u USERNAME --password-stdin```
- Find your node's IP address and modify the client's index.js file in client/src
  - Run ```kubectl get nodes -o wide``` to find your node's IP address
  - Type that address where it says NODE-IP in client/src/index.js
- Create and push your server and client images to the registry 
  - Use these commands for the server image:
    ``` 
    cd server
    docker build -t server-img .
    docker tag server-img ghcr.io/USERNAME/server-img
    docker push ghcr.io/USERNAME/server-img:latest
    ```
  - Use these commands for the client image:
    ```
    cd client
    docker build -t client-img .
    docker tag client-img ghcr.io/USERNAME/client-img
    docker push ghcr.io/USERNAME/client-img:latest
    ```
- Use your GHCR registry with Kubernetes
  - Create and encode an authentication string using your GitHub username and PAT token: ```echo -n "USERNAME:PAT_TOKEN" | base64```
  - We can use this to create our dockerconfig.json file
    - Pass the result of the previous command into this one: ```echo -n  '{"auths":{"ghcr.io":{"auth":"RESULT"}}}' | base64```
    - Modify the dockerconfig.json file within the Kubernetes folder by pasting the result of your last command where it says RESULT
  - Create a new secret using your dockerconfig.json file: ```kubectl create -f dockerconfigjson.yaml```
- Type your GitHub username where it says USERNAME within the deployment_client.yaml and deployment_server.yaml files in the Kubernetes folder
- Run your pods and services
  ```
  kubectl apply -f deployment_client.yaml
  kubectl apply -f deployment_server.yaml
  kubectl apply -f service_client.yaml
  kubectl apply -f service_server.yaml
  ```
- Access your service from an external browser
  - Type NODE-IP:30000 in your browser. You should be able to access and run commands on the web terminal

## Usage
These web terminals will be integrated into the VersionWise application as described in the README.md file for the Version-Wise repository.

## Contributing
The next steps for the web terminals are:
- Enable User Authentication
  - Every user of the application should receive their own server backend pod to run their commands on
- Pod Autoscaling based on the number of users
  - The number of server pods should be automatically increased on decreased based on the number of registered users
- Data persistence between sessions
  - Even if the user closes their browser window, their server container should remember the changes made

## CI/CD
- CI Pipeline
  - Whenever anyone pushes code to any of the branches, there will be a test to see if we can curl the endpoints of both the server and client within the docker containers
- CD Pipeline
  - Whenever anyone pushes/merges to main, the server and client images will be updated in Maahika's Github Container Registry, and the NODE-IP address within client/src/index.js will be changed to Maahika's Node IP address
