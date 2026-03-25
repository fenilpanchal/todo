

pipeline {
    agent { label 'docker' }   

    parameters {
        string(name: 'BRANCH', defaultValue: 'main', description: 'Git Branch')

        string(name: 'REMOTE_HOST', defaultValue: '192.168.1.10', description: 'Remote Server IP')
        string(name: 'REMOTE_USER', defaultValue: 'test2', description: 'Remote Username')
        string(name: 'REMOTE_DIR', defaultValue: '/home/test2/app', description: 'Deployment Directory')
    }

    stages {

        stage('Fetch Parameters') {
            steps {
                echo "Branch: ${params.BRANCH}"
                echo "Deploying to: ${params.REMOTE_USER}@${params.REMOTE_HOST}"
            }
        }

        stage('Clone Repository') {
            steps {
                script {
                    if (!fileExists('.git')) {
                        git branch: "${params.BRANCH}", url: "https://github.com/fenilpanchal/todo.git"
                    } else {
                        sh "git fetch --all"
                        sh "git checkout ${params.BRANCH}"
                        sh "git pull origin ${params.BRANCH}"
                    }
                }
            }
        }

        stage('Prepare Remote Server') {
            steps {
                sh """
                ssh ${params.REMOTE_USER}@${params.REMOTE_HOST} "mkdir -p ${params.REMOTE_DIR}"
                """
            }
        }

        stage('Transfer Files') {
            steps {
                sh """
                scp docker-compose.yml ${params.REMOTE_USER}@${params.REMOTE_HOST}:${params.REMOTE_DIR}/
                scp .env ${params.REMOTE_USER}@${params.REMOTE_HOST}:${params.REMOTE_DIR}/
                scp -r database ${params.REMOTE_USER}@${params.REMOTE_HOST}:${params.REMOTE_DIR}/
                """
            }
        }

        stage('Pull Docker Images') {
            steps {
                sh """
                ssh ${params.REMOTE_USER}@${params.REMOTE_HOST} '
                    docker pull 123fenil/todo-app-frontend:v2
                    docker pull 123fenil/todo-app-backend:v2
                '
                """
            }
        }

        stage('Run Docker Compose') {
            steps {
                sh """
                ssh ${params.REMOTE_USER}@${params.REMOTE_HOST} '
                    cd ${params.REMOTE_DIR}

                    docker-compose down || true
                    docker-compose up -d
                '
                """
            }
        }
    }

}

