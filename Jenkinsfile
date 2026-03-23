

pipeline {
    agent any

    environment {
        VM_IP     = "20.20.1.166"
        VM_USER   = "zymr"
        APP_DIR   = "/home/zymr/"
        REPO_URL  = "https://github.com/fenilpanchal/todo.git"
        BRANCH    = "main"
    }

    stages {

        stage('Deploy') {
            steps {
                sshagent(['test']) {
                    sh """
                    ssh -o StrictHostKeyChecking=no ${VM_USER}@${VM_IP} '


                        if [ ! -d "${APP_DIR}/.git" ]; then
                            echo "Repo not found → Cloning..."
                            git clone -b ${BRANCH} ${REPO_URL} ${APP_DIR}
                        else
                            echo "Repo already exists → Skipping clone"
                        fi

                        cd ${APP_DIR}

                        docker-compose down
                        docker-compose up -d --build

                    '
                    """
                }
            }
        }

    }
}


