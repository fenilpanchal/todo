
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
	            sh 'sudo docker-compose up -d --build'
	        }
	    }
       	}
       
    }


