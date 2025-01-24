pipeline {
    agent { docker { image 'mcr.microsoft.com/playwright:v1.50.0-noble' } }

    environment {
        PATH = "$PATH:/usr/local/bin"
    }

    stages {
        stage('Install Playwright') {
            steps {
                sh '''
                    brew install node
                    npm install
                '''
            }
        }

        stage("Checkout Test Framework Repo") {
            steps {
                git branch: 'main', url: 'https://github.com/krishanuc1001/FabricGroup-Parabank-Playwright-Assignment'
            }
        }

        stage('Test') {
            steps {
                sh 'npx ci'
                sh 'npx playwright test'


            }
            post {
                always {
                    script {
                        publishHTML([allowMissing         : true,
                                     alwaysLinkToLastBuild: true,
                                     keepAll              : true,
                                     reportDir            : 'playwright-report',
                                     reportFiles          : 'index.html',
                                     reportName           : 'Playwright Test Report',
                                     reportTitles         : 'Playwright Test Report'])
                        echo "Success !!! Playwright report published..."
                    }
                }
            }
        }

        stage('Tear Down') {
            steps {
                echo 'Tearing down...'
            }
        }
    }
}