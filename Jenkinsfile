
pipeline {
    agent { label 'docker' }

      stages {

        stage('Stop Containers') {
            steps {
                sh 'sudo docker-compose down'
            }
        }

        stage('Build and Start Containers') {
    	
            steps {
        	sh """
        	BACKEND_PORT=${params.BACKEND_PORT} \
        	FRONTEND_PORT=${params.FRONTEND_PORT} \
        	docker-compose up -d --build
        	"""
            }

        } 

    } 
    
}

