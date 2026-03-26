

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

        string(name: 'FRONTEND_IMAGE', defaultValue: '', description: 'Frontend Image')
       

        string(name: 'BACKEND_IMAGE', defaultValue: '', description: 'Backend Image')
        

        string(name: 'REMOTE_HOST', defaultValue: '', description: 'Remote Server IP')
        string(name: 'REMOTE_USER', defaultValue: '', description: 'Remote Username')
        string(name: 'REMOTE_DIR', defaultValue: '', description: 'Deployment Directory')
    }

    stages {

        stage('Fetch Parameters') {
            steps {
                echo "Branch: ${params.BRANCH_NAME}"
                echo "Frontend: ${params.FRONTEND_IMAGE}:${params.IMAGE_TAG}"
                echo "Backend: ${params.BACKEND_IMAGE}:${params.IMAGE_TAG}"
            }
        }

        stage('Clone Repository') {
            steps {
                git branch: "${params.BRANCH_NAME.split('/').last()}",
                    url: "https://github.com/fenilpanchal/todo.git"
            }
        }
        
 

        stage('Set Tag') {
	    steps {
        	script {
                    IMAGE_TAG = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
       		}
   	    }
	}

 
        stage('Build Docker Images') {
            steps {
                sh """
                docker build -t ${params.FRONTEND_IMAGE}:${params.IMAGE_TAG} ./frontend
                docker build -t ${params.BACKEND_IMAGE}:${params.IMAGE_TAG} ./backend
                """
            }
        }

        stage('Push to DockerHub') {
            steps {
                withCredentials([usernamePassword(credentialsId: '77', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh """
                    echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin
                    docker push ${params.FRONTEND_IMAGE}:${params.IMAGE_TAG}
                    docker push ${params.BACKEND_IMAGE}:${params.IMAGE_TAG}
                    """
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
                tar -czvf app.tar.gz docker-compose.yml .env database

                scp app.tar.gz ${params.REMOTE_USER}@${params.REMOTE_HOST}:${params.REMOTE_DIR}/

                ssh ${params.REMOTE_USER}@${params.REMOTE_HOST} "
                    cd ${params.REMOTE_DIR} &&
                    tar -xzvf app.tar.gz &&
                    rm app.tar.gz
                "
                """
            }
        }

        stage('Deploy Application') {
            steps {
                sh """
                ssh ${params.REMOTE_USER}@${params.REMOTE_HOST} "
                    cd ${params.REMOTE_DIR} &&
                    docker pull ${params.FRONTEND_IMAGE}:${params.IMAGE_TAG} &&
                    docker pull ${params.BACKEND_IMAGE}:${params.IMAGE_TAG} &&
                    docker-compose up -d --build &&
                    docker image prune -f
                "
                """
            }
        }
    }
}


