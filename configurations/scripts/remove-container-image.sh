CONTAINER_NAME=$1
IMAGE_NAME=$2


echo "CONTAINER_NAME: $CONTAINER_NAME"
echo "IMAGE_NAME: $IMAGE_NAME" 

sudo docker stop $CONTAINER_NAME
sudo docker system prune -f
sudo docker image rmi $IMAGE_NAME