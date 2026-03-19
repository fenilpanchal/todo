
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
        	export BACKEND_PORT=${params.BACKEND_PORT} 
        	export FRONTEND_PORT=${params.FRONTEND_PORT} 
        	docker-compose -env--file .env up -d --build
        	"""
            }

        }

     }

}
