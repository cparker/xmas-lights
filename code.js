var mod = angular.module('xmas-lights', [])

mod.controller('mainCtrl', ['$log', '$scope', 'mainSrv', ($log, $scope, mainSrv) => {
    $scope.buttons = {
        outsideTree: 'off',
        shelf: 'off',
        insideTree: 'on'
    }
    $scope.message = 'cool'

    $scope.updateButtonState = (buttonName) => {
      mainSrv.getButtonState(buttonName)
        .then(response => {
            $log.info('response', response)
            $scope.buttons[buttonName] = response.data.data.metrics.level
        }, err => {
            $log.error('error', err)
        })
    }


    $scope.click = (buttonName) => {
        console.log('clicked', buttonName)

        // send message
        mainSrv.setButtonState(buttonName, $scope.buttons[buttonName] === 'on' ? 'off' : 'on')

        // wait a second then get state
        setTimeout(() => {
          $scope.updateButtonState(buttonName)
        }, 1000)

        // set button state to transition
        $scope.buttons[buttonName] = 'transition'
    }

    $scope.updateButtonState('shelf')
    $scope.updateButtonState('outsideTree')
}])


mod.factory('mainSrv', ['$http', '$log', ($http, $log) => {

    let buttonDevices = {
        outsideTree: 'ZWayVDev_zway_3-0-37',
        insideTree: 'NONEYET',
        shelf: 'ZWayVDev_zway_5-0-37'
    }


    return {
        setButtonState: (buttonName, state) => {
            console.log('setting ', buttonName, state)
            return $http.get('/setState', {
                    params: {
                        buttonName: buttonDevices[buttonName],
                        state: state
                    }
                })
                .then(response => {
                    $log.info('response', response)
                }, err => {
                    $log.error('err', err)
                })
        },

        getButtonState: (buttonName) => {
            return $http.get('/getState', {
                params: {
                    buttonName: buttonDevices[buttonName]
                }
            })
        }
    }

}])
