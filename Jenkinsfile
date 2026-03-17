
pipeline {
    agent { label 'docker' }

    parameters {
        string(name: 'FRONTEND_PORT', defaultValue: '3000', description: 'Frontend Port')
        string(name: 'BACKEND_PORT', defaultValue: '5000', description: 'Backend Port')
    }

    stages {

        stage('Show Ports') {
            steps {
                echo "Frontend Port: ${params.FRONTEND_PORT}"
                echo "Backend Port: ${params.BACKEND_PORT}"
            }
        }

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


