
pipeline {
    agent { label 'docker' }

    parameters {
        string(name: 'FRONTEND_PORT', defaultValue: '3000', description: 'Frontend Port')
        string(name: 'BACKEND_PORT', defaultValue: '5000', description: 'Backend Port')
    }

    stages {
        stage('Stop Old Containers') {
            steps {
                sh 'docker-compose down'
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
