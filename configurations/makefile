## Constants
FRONTEND_CONTAINER_NAME :=dayiri_frontend
BACKEND_CONTAINER_NAME :=dayiri_backend

FRONTEND_IMAGE_NAME :=dayiri_frontned_image
BACKEND_IMAGE_NAME :=dayiri_backend_image

FRONTEND_REPO :=dayiri-admin
BACKEND_REPO :=dayiri-backend

live:
	sudo docker-compose down
	sudo docker system prune -f
	sudo docker-compose up -d

live-frontend:
	@ make remove-frontend
	@ make pull REPO_NAME=$(FRONTEND_REPO)
	@ docker-compose up -d
live-backend:
	@ make remove-backend
	@ make pull REPO_NAME=$(BACKEND_REPO)
	@ docker-compose up -d


pull-all-project-bash:
	@ chmod +x ./scripts/pull-all-repos.sh
	@ ./scripts/pull-all-repos.sh $(REPO_NAME) $(USERNAME) $(TOKEN)
pull: ## Pull repo for all local services
	@ make pull-all-project-bash REPO_NAME="$(REPO_NAME)" USERNAME="$(USERNAME)" TOKEN="$(TOKEN)"
	
remove-container-bash:
	@ chmod +x ./scripts/remove-container-image.sh
	@ ./scripts/remove-container-image.sh $(CONTAINER_NAME) $(CONTAINER_IMAGE)
remove-frontend:
	make remove-container-bash CONTAINER_NAME="$(FRONTEND_CONTAINER_NAME)" CONTAINER_IMAGE="$(FRONTEND_IMAGE_NAME)"
remove-backend:
	make remove-container-bash CONTAINER_NAME="$(BACKEND_CONTAINER_NAME)" CONTAINER_IMAGE="$(BACKEND_IMAGE_NAME)"