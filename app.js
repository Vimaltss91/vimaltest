var app = angular.module('BuildDeploymentTestApp', []);


    // Define options for Enable PP Branch


app.controller('BuildDeploymentTestController', function($scope) {
    $scope.showPolicyReleaseTag = false;
    $scope.showBsfReleaseTag = false;
    $scope.showCommonReleaseTag = false;
    $scope.parameterList = {}; // Object to store parameter key-value pairs

    $scope.ppBranchOptions = [
        { value: 'JAR_PP_BRANCH', label: 'JAR_PP_BRANCH' },
        { value: 'COMMON_SVC_PP_BRANCH', label: 'COMMON_SVC_PP_BRANCH' },
        { value: 'POLICY_PP_BRANCH', label: 'POLICY_PP_BRANCH' },
        { value: 'BSF_PP_BRANCH', label: 'BSF_PP_BRANCH' },
        { value: 'INTEGRATION_TEST_PP_BRANCH', label: 'INTEGRATION_TEST_PP_BRANCH' },
        { value: 'PLAY_PP_BRANCH', label: 'PLAY_PP_BRANCH' },
        { value: 'TRIGGER_BRANCH', label: 'TRIGGER_BRANCH' },
        { value: 'OCP_TPD_BRANCH', label: 'OCP_TPD_BRANCH' },
        { value: 'FEATURE_BRANCH', label: 'FEATURE_BRANCH' }
    ];

    $scope.updateReleaseTags = function() {
        // Reset all flags
        $scope.showPolicyReleaseTag = false;
        $scope.showBsfReleaseTag = false;
        $scope.showCommonReleaseTag = false;
        $scope.ppBranch = {};
    
        // Initialize ppBranchValues object to store input values
        $scope.ppBranchValues = {};

        // Check the selected option and set corresponding flags
        switch ($scope.buildSut) {
            case 'policy_bsf_all':
                $scope.showPolicyReleaseTag = true;
                $scope.showBsfReleaseTag = true;
                $scope.showCommonReleaseTag = true;
                break;
            case 'policy_all':
                $scope.showPolicyReleaseTag = true;
                $scope.showCommonReleaseTag = true;
                break;
            case 'bsf_all':
                $scope.showBsfReleaseTag = true;
                $scope.showCommonReleaseTag = true;
                break;
            case 'common_svc_specific':
            case 'common_svc_all':
            case 'jars_specific':
                $scope.showCommonReleaseTag = true;
                break;
            case 'policy_specific':
                $scope.showPolicyReleaseTag = true;
                break;
            case 'bsf_specific':
                $scope.showBsfReleaseTag = true;
                break;
            case 'policy_bsf_specific':
                $scope.showPolicyReleaseTag = true;
                $scope.showBsfReleaseTag = true;
                break;
            default:
                break;
        }
    };

    $scope.updatePPBranchInputs = function() {
        // Hide all input fields
        for (var option in $scope.ppBranchOptions) {
            if ($scope.ppBranchOptions.hasOwnProperty(option)) {
                $scope.ppBranchValues[$scope.ppBranchOptions[option].value] = '';
            }
        }
    };

    // Function to append PP_BRANCH values to the existing Build_SUT parameter values
    $scope.appendPPBranchValues = function() {
        for (var option in $scope.ppBranchOptions) {
            if ($scope.ppBranchOptions.hasOwnProperty(option)) {
                if ($scope.ppBranch[$scope.ppBranchOptions[option].value]) {
                    $scope.parameterList[$scope.ppBranchOptions[option].value] = $scope.ppBranchValues[$scope.ppBranchOptions[option].value];
                }
            }
        }
    };

    $scope.submitForm = function() {
        // Reset parameter list
        $scope.parameterList = {};

            // Add One-Click-Play Branch parameter
        if ($scope.oneClickPlayBranch) {
            $scope.parameterList['ref'] = $scope.oneClickPlayBranch;
        }
    
        // Add parameters and their values to the list only if enableBuild is checked
        if ($scope.enableBuild) {
            if ($scope.buildSut) {
                $scope.parameterList['BUILD_SUT'] = $scope.buildSut;
            }
            if ($scope.policyReleaseTag) {
                $scope.parameterList['POLICY_RELEASE_TAG'] = $scope.policyReleaseTag;
            }
            if ($scope.bsfReleaseTag) {
                $scope.parameterList['BSF_RELEASE_TAG'] = $scope.bsfReleaseTag;
            }
            if ($scope.commonReleaseTag) {
                $scope.parameterList['COMMON_RELEASE_TAG'] = $scope.commonReleaseTag;
            }
            if ($scope.buildAts !== undefined) {
                $scope.parameterList['BUILD_ATS'] = $scope.buildAts ? 'True' : 'False';
            }
            if ($scope.csar !== undefined) {
                $scope.parameterList['CSAR'] = $scope.csar ? 'True' : 'False';
            }

            $scope.appendPPBranchValues();
            console.log($scope.parameterList);
        }
    
        // Show the parameter list
        $scope.showParams = true;
    };

    $scope.generatePipelineURL = function() {
        // Base URL
        var baseURL = 'https://gitlab.com/vimaltss91/cicd/-/pipelines/new';
    
        // Retrieve ref value from key-value pairs
        var refValue = $scope.parameterList['ref'];
    
        // Construct dynamic parameters from key-value pairs
        var dynamicParams = '';
        for (var key in $scope.parameterList) {
            if (key !== 'ref' && $scope.parameterList.hasOwnProperty(key)) {
                dynamicParams += '&var[' + key + ']=' + $scope.parameterList[key];
            }
        }
    
        // Construct the final URL
        $scope.pipelineURL = baseURL + '?ref=' + refValue + dynamicParams;
    };

    // Function to generate the trigger pipeline URL
    // $scope.generatePipelineURL = function() {
    //     var url = 'https://gitlab.com/vimaltss91/cicd/-/pipelines/new?ref=' + $scope.ref;
    //     for (var option in $scope.ppBranchOptions) {
    //         if ($scope.ppBranchOptions.hasOwnProperty(option)) {
    //             if ($scope.ppBranch[$scope.ppBranchOptions[option].value]) {
    //                 url += '&var[' + $scope.ppBranchOptions[option].value + ']=' + $scope.ppBranchValues[$scope.ppBranchOptions[option].value];
    //             }
    //         }
    //     }
    //     return url;
    // };
    
    
    
    
    
});
