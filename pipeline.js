pipeline {
  environment {
    registry = "kkubuntu/testrepo"
    registryCredential = 'dockerhub'
  }
  agent any
  stages {
    stage('Cloning Git') {
      steps {
        git 'https://github.com/kknaidumca/movieinventory.git/'
      }
    }
    stage('Building image') {
      steps{
        script {
          docker.build registry + ":$BUILD_NUMBER"
        }
      }
    }
    stage('Deploy Image') {
    steps{    script {
    dockerImage = docker.build registry + ":$BUILD_NUMBER"
      docker.withRegistry( '', registryCredential ) {
        dockerImage.push()
      }
    }
  }
}
  }
}
