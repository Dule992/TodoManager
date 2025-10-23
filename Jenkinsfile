pipeline {
  agent any

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Start services (detached)') {
      steps {
        sh '''
          rm -rf artifacts || true
          mkdir -p artifacts
          # Use docker/compose container to run compose if host has no docker-compose binary
          docker run --rm -v /var/run/docker.sock:/var/run/docker.sock -v "$PWD":/workspace -w /workspace docker/compose:latest up -d --build
        '''
      }
    }

    stage('Wait for backend') {
      steps {
        sh '''
          chmod +x scripts/wait-for-url.sh
          ./scripts/wait-for-url.sh http://localhost:4000 30 2
        '''
      }
    }

    stage('Wait for frontend') {
      steps {
        sh '''
          ./scripts/wait-for-url.sh http://localhost:5173 30 2
        '''
      }
    }

    stage('Run tests in Docker') {
      steps {
        sh '''
           # Use docker/compose container to run the CI compose file and exit with tests result
          docker run --rm -v /var/run/docker.sock:/var/run/docker.sock -v "$PWD":/workspace -w /workspace docker/compose:latest -f docker-compose.yml -f docker-compose.ci.yml up --abort-on-container-exit --exit-code-from tests --build
        '''
      }
    }
  }

  post {
    always {
      sh '''
        docker-compose -f docker-compose.yml -f docker-compose.ci.yml down --volumes --remove-orphans || true
        ls -la artifacts || true
      '''
      archiveArtifacts artifacts: 'artifacts/**', allowEmptyArchive: true
      junit allowEmptyResults: true, testResults: 'artifacts/**/test-results/**/*.xml'
    }
  }
}