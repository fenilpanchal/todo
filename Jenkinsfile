

pipeline {
    agent { label 'docker' }

    parameters {
        string(name: 'BRANCH', defaultValue: 'main', description: 'Git Branch')

        // 🔹 Frontend
        string(name: 'FRONTEND_IMAGE', defaultValue: 'yourdockerhub/frontend', description: 'Frontend Image')
        string(name: 'FRONTEND_TAG', defaultValue: 'latest', description: 'Frontend Tag')

        // 🔹 Backend
        string(name: 'BACKEND_IMAGE', defaultValue: 'yourdockerhub/backend', description: 'Backend Image')
        string(name: 'BACKEND_TAG', defaultValue: 'latest', description: 'Backend Tag')

        // 🔹 Remote
        string(name: 'REMOTE_HOST', defaultValue: '192.168.1.10', description: 'Remote Server IP')
        string(name: 'REMOTE_USER', defaultValue: 'test2', description: 'Remote Username')
        string(name: 'REMOTE_DIR', defaultValue: '/home/test2/app', description: 'Deployment Directory')
    }

    stages {

        // 🔹 1. Show Parameters
        stage('Fetch Parameters') {
            steps {
                echo "Branch: ${params.BRANCH}"
                echo "Frontend: ${params.FRONTEND_IMAGE}:${params.FRONTEND_TAG}"
                echo "Backend: ${params.BACKEND_IMAGE}:${params.BACKEND_TAG}"
                echo "Deploying to: ${params.REMOTE_USER}@${params.REMOTE_HOST}"
            }
        }

        // 🔹 2. Clone (avoid re-clone issue)
        stage('Clone Repository') {
            steps {
                script {
                    if (!fileExists('.git')) {
                        git branch: "${params.BRANCH}", url: "https://github.com/your-username/your-repo.git"
                    } else {
                        sh "git fetch --all"
                        sh "git checkout ${params.BRANCH}"
                        sh "git pull origin ${params.BRANCH}"
                    }
                }
            }
        }

        // 🔹 3. Build Images
        stage('Build Docker Images') {
            steps {
                sh """
                docker build -t ${params.FRONTEND_IMAGE}:${params.FRONTEND_TAG} ./frontend
                docker build -t ${params.BACKEND_IMAGE}:${params.BACKEND_TAG} ./backend
                """
            }
        }

        // 🔹 4. Push Images
        stage('Push to DockerHub') {
            steps {
                withCredentials([usernamePassword(credentialsId: '77', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh """
                    echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin

                    docker push ${params.FRONTEND_IMAGE}:${params.FRONTEND_TAG}
                    docker push ${params.BACKEND_IMAGE}:${params.BACKEND_TAG}
                    """
                }
            }
        }

        // 🔹 5. Prepare Remote
        stage('Prepare Remote Server') {
            steps {
                sh """
                ssh ${params.REMOTE_USER}@${params.REMOTE_HOST} "mkdir -p ${params.REMOTE_DIR}"
                """
            }
        }

        // 🔹 6. Transfer Files
        stage('Transfer Files') {
            steps {
                sh """
                scp docker-compose.yml ${params.REMOTE_USER}@${params.REMOTE_HOST}:${params.REMOTE_DIR}/
                scp -r database ${params.REMOTE_USER}@${params.REMOTE_HOST}:${params.REMOTE_DIR}/
                """
            }
        }

        // 🔹 7. Deploy
        stage('Deploy Application') {
            steps {
                sh """
                ssh ${params.REMOTE_USER}@${params.REMOTE_HOST} '
                    cd ${params.REMOTE_DIR}

                    docker pull ${params.FRONTEND_IMAGE}:${params.FRONTEND_TAG}
                    docker pull ${params.BACKEND_IMAGE}:${params.BACKEND_TAG}
                  

                    docker-compose down || true
                    docker-compose up -d
                '
                """
            }
        }
    }

    post {
        success {
            echo "✅ Deployment Successful!"
        }
        failure {
            echo "❌ Deployment Failed!"
        }
    }
}


