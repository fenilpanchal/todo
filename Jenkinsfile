pipeline {
    agent { label 'docker' }

    parameters {
        gitParameter(
            name: 'BRANCH_NAME',
            type: 'PT_BRANCH',
            defaultValue: 'main',
            description: 'Select Git Branch',
            branchFilter: '.*'
        )

        string(name: 'FRONTEND_PORT', defaultValue: '3000', description: 'Frontend Port')
        string(name: 'BACKEND_PORT', defaultValue: '5000', description: 'Backend Port')
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: "${params.BRANCH_NAME.split('/').last()}",
                    url: 'https://github.com/fenilpanchal/todo.git'
            }
        }

        // ✅ THIS IS WHAT YOU WANT
        stage('Create .env File') {
            steps {
                sh """
                echo "FRONTEND_PORT=${params.FRONTEND_PORT}" > .env
                echo "BACKEND_PORT=${params.BACKEND_PORT}" >> .env
                """
            }
        }

        stage('Stop Old Containers') {
            steps {
                sh 'docker-compose down || true'
            }
        }

        stage('Build and Start Containers') {
            steps {
                sh """
                docker-compose --env-file .env up -d --build
                """
            }
        }
    }
}
