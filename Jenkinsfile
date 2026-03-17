
pipeline {
agent { label 'docker' }

      	stages {
	    stage('Stop Containers') {
	        steps {
	            sh 'docker-compose down'
	        }
	    }

	    stage('Build and Start Containers') {
	        steps {
	            sh 'docker-compose up -d --build'
	        }
	    }
       	}
       
    }


