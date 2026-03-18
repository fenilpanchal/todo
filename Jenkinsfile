
pipeline {
    agent { label 'docker' }

    parameters {
        string(name: 'FRONTEND_PORT', defaultValue: '3000', description: 'Frontend Port')
        string(name: 'BACKEND_PORT', defaultValue: '5000', description: 'Backend Port')
    }

    stages {

        stage('Create .env File') {
            steps {
                sh """
                    echo "BACKEND_PORT=${params.BACKEND_PORT}" > .env
                    echo "FRONTEND_PORT=${params.FRONTEND_PORT}" >> .env
                """
            }
        }

        stage('Stop Old Containers') {
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

