pipeline {
    agent any

    tools {
        // Requires NodeJS plugin installed and "NodeJS" defined in Manage Jenkins > Tools
        nodejs 'NodeJS'
    }

    environment {
        APP_NAME     = "essentials"
        DOCKER_IMAGE = "essentials-local"
    }

    options {
        disableConcurrentBuilds()
        timestamps()
        buildDiscarder(logRotator(numToKeepStr: '10')) // keep only last 10 builds
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Quality Checks') {
            parallel {
                stage('Unit Tests') {
                    steps {
                        // run Karma tests in headless mode
                        sh '''
                            npm test -- --watch=false --browsers=ChromeHeadless || {
                                echo "Tests failed";
                                exit 1;
                            }
                        '''
                    }
                }

                stage('Lint') {
                    steps {
                        script {
                            def hasLint = fileExists('package.json') && 
                                sh(script: "node -e \"console.log(require('./package.json').scripts?.lint ? 'yes' : 'no')\"", returnStdout: true).trim()
                            if (hasLint == 'yes') {
                                sh 'npm run lint'
                            } else {
                                echo "No lint script configured, skipping lint."
                            }
                        }
                    }
                }
            }
        }

        stage('Build (production)') {
            steps {
                sh 'npm run build -- --configuration production'
                sh 'ls -la dist || true'
            }
        }

        stage('Docker Build') {
            steps {
                sh "docker build -t ${DOCKER_IMAGE}:${env.BUILD_NUMBER} ."
                sh "docker tag ${DOCKER_IMAGE}:${env.BUILD_NUMBER} ${DOCKER_IMAGE}:latest"
            }
        }

        stage('Deploy to Local Test') {
            steps {
                sh '''
                    docker rm -f ${APP_NAME}-test || true
                    docker run -d --name ${APP_NAME}-test -p 8080:80 ${DOCKER_IMAGE}:latest
                '''
                echo "App running at: http://<jenkins-host-ip>:8080"
            }
        }
    }

    post {
        always {
            sh 'docker images | head -n 20 || true'
            cleanWs()
        }
        success {
            echo "✅ Pipeline finished successfully."
        }
        failure {
            echo "❌ Pipeline failed — check logs."
        }
    }
}
