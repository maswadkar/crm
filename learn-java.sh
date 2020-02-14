#!/bin/bash
export INSTANCE_NAME=java-002
export IMAGE_FAMILY=debian-10
export IMAGE_PROJECT=debian-cloud
export MACHINE_TYPE=f1-micro
export ZONE=europe-west6-a

gcloud compute instances create ${INSTANCE_NAME} \
                                --zone ${europe-west6-a} \
                                --image-family ${IMAGE_FAMILY}  --image-project ${IMAGE_PROJECT} \
                                --machine-type ${MACHINE_TYPE}

