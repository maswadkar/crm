#!/bin/bash
export PROJECT_ID=neophilex-alpha
export MYCLUSTER=my-kub-cluster-001
export MY_DEPLOYMENT=my-deployment-001
export MY_APP=crm
export COMPUTE_ENGINE_ZONE=europe-west6-b
export MACHINE_TYPE=g1-small
export MY_APP_SERVICE=my-app-service

gcloud container clusters create ${MYCLUSTER} --machine-type=${MACHINE_TYPE} \
                                              --num-nodes=2 \
                                              --zone=${COMPUTE_ENGINE_ZONE}


#Step 1: Build the container image
docker build -t gcr.io/${PROJECT_ID}/${MY_APP}:v1 .
docker images

#Step 2: Upload the container image
docker push gcr.io/${PROJECT_ID}/${MY_APP}:v1


#Step 3: Run your container locally (optional)
docker run --rm -p 8080:8080 gcr.io/${PROJECT_ID}/${MY_APP}:v1

#Step 4: Create a container cluster

gcloud config set project $PROJECT_ID
gcloud config set compute/zone ${COMPUTE_ENGINE_ZONE}

gcloud container clusters create ${MYCLUSTER} --machine-type=${MACHINE_TYPE} \
                                              --num-nodes=2 \
                                              --zone=${COMPUTE_ENGINE_ZONE}


#Step 5: Deploy your application
kubectl create deployment ${MY_DEPLOYMENT} --image=gcr.io/${PROJECT_ID}/${MY_APP}:v1
kubectl get deployment
kubectl get pods

#Step 6: Expose your application to the Internet
kubectl get service
kubectl expose deployment ${MY_DEPLOYMENT} --name ${MY_APP_SERVICE} --type=LoadBalancer --port 80 --target-port 8080
kubectl get service


#Step 7: Scale up your application
kubectl scale deployment ${MY_DEPLOYMENT} --replicas=3

kubectl get deployment ${MY_DEPLOYMENT}

kubectl get pods

#Step 8: Deploy a new version of your app
docker build -t gcr.io/${PROJECT_ID}/${MY_APP}:v2 .
docker push gcr.io/${PROJECT_ID}/${MY_APP}:v2

#Now, apply a rolling update to the existing deployment with an image update:
kubectl set image deployment/${MY_DEPLOYMENT} ${MY_APP}=gcr.io/${PROJECT_ID}/${MY_APP}:v2

#Steps 9: Enable autoscaling Cluster
gcloud container clusters update ${MYCLUSTER} --enable-autoscaling --min-nodes 1 --max-nodes 4 --zone europe-west6-b
gcloud beta container clusters update ${MYCLUSTER} --autoscaling-profile optimize-utilization




#Steps 10: Clean up the project
gcloud container clusters delete ${MYCLUSTER}
