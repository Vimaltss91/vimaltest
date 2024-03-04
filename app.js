var app = angular.module('BuildDeploymentTestApp', []);

app.controller('BuildDeploymentTestController', function($scope) {
    $scope.showPolicyReleaseTag = false;
    $scope.showBsfReleaseTag = false;
    $scope.showCommonReleaseTag = false;
    $scope.parameterList = {}; // Object to store parameter key-value pairs
    $scope.deployments = [];
    $scope.enableDeployment = false;
    $scope.nfType = '';
    $scope.oneClickPlayBranch = ''; // Initialize the model for oneClickPlayBranch
    $scope.otherBranch = ''; // Initialize the model for otherBranch
    $scope.showOtherInput = false; // Initialize the flag to show the other input
    $scope.showTPD = false;
    $scope.showUPGRADE_CHARTS = false;
    $scope.showOVERWRITE_EXTERNAL_HELM = false;
    $scope.showBUILD_CONFIG_SNAPSHOT = false;
    $scope.showPKG_SCAN = false;
    $scope.showORG_GRADLE_PROJECT_ocpmCatalogURL = false;
    $scope.showReleaseTags = false;
    $scope.releaseTags = {
        POLICY_RELEASE_TAG: '',
        BSF_RELEASE_TAG: '',
        ATS_POLICY_RELEASE_TAG: '',
        ATS_BSF_RELEASE_TAG: ''
    };

    $scope.deployParams = {
        CONTRACT_TEST: false,
        INCLUDE_OCC_TEST: false,
        REPORT: false
    };
    



    // $scope.nfTypeOptions = ['Policy', 'BSF'];

    $scope.nfTypeOptions = [
        { value: 'policy', label: 'Policy' },
        { value: 'bsf', label: 'BSF' }
    ];

    $scope.ppBranchOptions = [
        { value: 'JAR_PP_BRANCH', label: 'JAR_PP_BRANCH' },
        { value: 'COMMON_SVC_PP_BRANCH', label: 'COMMON_SVC_PP_BRANCH' },
        { value: 'POLICY_PP_BRANCH', label: 'POLICY_PP_BRANCH' },
        { value: 'BSF_PP_BRANCH', label: 'BSF_PP_BRANCH' },
        { value: 'INTEGRATION_TEST_PP_BRANCH', label: 'INTEGRATION_TEST_PP_BRANCH' },
        { value: 'PLAY_PP_BRANCH', label: 'PLAY_PP_BRANCH' },
        { value: 'TRIGGER_BRANCH', label: 'TRIGGER_BRANCH' },
        { value: 'OCP_TPD_BRANCH', label: 'OCP_TPD_BRANCH' },
        { value: 'FEATURE_BRANCH', label: 'FEATURE_BRANCH' },
        { value: 'ATS_PP_BRANCH', label: 'ATS_PP_BRANCH' },
        { value: 'CNC_MIB_BRANCH', label: 'CNC_MIB_BRANCH' },
        { value: 'ORG_GRADLE_PROJECT_ocpmCatalogURL', label: 'ORG_GRADLE_PROJECT_ocpmCatalogURL' }
    ];

    $scope.toggleOtherBuildParameters = function() {
        $scope.enableOtherBuildParameters = !$scope.enableOtherBuildParameters;
        // Logic to show/hide each input based on checkbox enablement
        $scope.showTPD = $scope.ppBranch['TPD'];
        $scope.showUPGRADE_CHARTS = $scope.ppBranch['UPGRADE_CHARTS'];
        $scope.showOVERWRITE_EXTERNAL_HELM = $scope.ppBranch['OVERWEITE_EXTERNAL_HELM'];
        $scope.showBUILD_CONFIG_SNAPSHOT = $scope.ppBranch['BUILD_CONFIG_SNAPSHOT'];
        $scope.showPKG_SCAN = $scope.ppBranch['PKG_SCAN'];
        $scope.showORG_GRADLE_PROJECT_ocpmCatalogURL = $scope.ppBranch['ORG_GRADLE_PROJECT_ocpmCatalogURL'];
    };


    // $scope.showReleaseTagFields = function() {
    //     $scope.showReleaseTags = true;
    // };


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

    // Function to add a new deployment section
    $scope.addDeployment = function() {
        $scope.deployments.push({
            nfType: '',
            bastionIP: '',
            bastionNamespace: '',
            bastionNamespaces: [],
            csar: false, // Initialize CSAR checkbox
            asm: false // Initialize ASM checkbox
        });
    };

    // Function to update BASTION_NAMESPACE options based on selected BASTION_IP
    $scope.updateBastionNamespaces = function(index) {
        var selectedIP = $scope.deployments[index].bastionIP;
        if (selectedIP === '100.100.10') {
            $scope.deployments[index].bastionNamespaces = ['o-devops-bsf', 'o-devops-bsf1', 'o-devops-bsf2', 'o-devops-policy', 'o-devops-policy1', 'o-devops-policy2'];
        } else if (selectedIP === '10.10.2') {
            $scope.deployments[index].bastionNamespaces = ['ci-devops-bsf', 'ci-devops-bsf1', 'ci-devops-bsf2', 'ci-devops-policy', 'ci-devops-policy1'];
        } else {
            $scope.deployments[index].bastionNamespaces = [];
        }
        // Reset selected BASTION_NAMESPACE
        $scope.deployments[index].bastionNamespace = '';
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

    
    $scope.appendDeploymentValues = function() {


        $scope.deployments.forEach(function(deployment) {
            // console.log("Appending Deployment Values. nfType:", nfType)
            if (deployment.bastionIP && deployment.bastionNamespace) {
                var prefix = '';
                var nfTypePrefix = '';

                if (deployment.nfType === 'policy') {
                    nfTypePrefix = 'POLICY_';
                } else if (deployment.nfType === 'bsf') {
                    nfTypePrefix = 'BSF_';
                }

                if (deployment.csar && deployment.asm) {
                    prefix = 'CSAR_ASM_' + nfTypePrefix;
                } else if (deployment.csar) {
                    prefix = 'CSAR_' + nfTypePrefix;
                } else if (deployment.asm) {
                    prefix = 'ASM_' + nfTypePrefix;
                } else {
                    prefix = nfTypePrefix;
                }
    
                $scope.parameterList[prefix + 'BASTION_IP'] = deployment.bastionIP;
                $scope.parameterList[prefix + 'BASTION_NAMESPACE'] = deployment.bastionNamespace;

                if (deployment.bastionIP === '100.100.10' ) {
                    $scope.parameterList[prefix + 'BASTION_USER'] = 'opc';
                } else if (deployment.bastionIP === '10.10.2') {
                    $scope.parameterList[prefix + 'BASTION_USER'] = 'cloud-user';
                }

                if (deployment.testType  === 'pcf' ) {
                    $scope.parameterList['TEST_POLICY_SUITE'] = 'PCF';
                    $scope.parameterList['POLICY_MODE'] = 'pcf';
                } else if (deployment.testType  === 'converged') {
                    $scope.parameterList['TEST_POLICY_SUITE'] = 'Converged Policy';
                    $scope.parameterList['POLICY_MODE'] = 'occnp';
                } else if (deployment.testType  === 'bsf') {
                    $scope.parameterList['TEST_BSF_SUITE'] = 'BSF';
                }

            }
        });
    };    
    
    $scope.toggleDeployment = function() {
        $scope.enableDeployment = !$scope.enableDeployment;
    };

    $scope.deleteDeployment = function(index) {
        $scope.deployments.splice(index, 1);
    };

    $scope.updateOneClickBranch = function() {
        $scope.showOtherInput = ($scope.oneClickPlayBranch === 'other');
        if (!$scope.showOtherInput) {
            $scope.otherBranch = ''; // Reset otherBranch value if not 'other' selected
        }
    };

    $scope.submitForm = function() {
        // Reset parameter list
        $scope.parameterList = {};

        if ($scope.oneClickPlayBranch === 'other' ) {
            if ( $scope.otherBranch.trim() === '') {
                alert("Please select a One-Click-Play Branch.");
                return; // Stop further execution
            }
            $scope.parameterList['ref'] = $scope.otherBranch;
        }
        else {
            if ( $scope.oneClickPlayBranch.trim() === '') {
                alert("Please select a One-Click-Play Branch.");
                return; // Stop further execution
            }
            $scope.parameterList['ref'] = $scope.oneClickPlayBranch;
        }

        for (var key in $scope.releaseTags) {
            if ($scope.releaseTags[key].trim() !== '') {
                $scope.parameterList[key] = $scope.releaseTags[key];
            }
        }

        if ($scope.enableScans) {
            if ($scope.fortifyScan && $scope.fortifyTargetBranch) {
                $scope.parameterList['FORTIFY_SCAN'] = true;
                if ( $scope.fortifyTargetBranch) {
                     $scope.parameterList['FORTIFY_TARGET_BRANCH'] = $scope.fortifyTargetBranch;
                }
            }
            if ($scope.bdRepoScan ) {
                $scope.parameterList['BD_REPO_SCAN'] = true;
                if ( $scope.bdProjectVersion) {
                $scope.parameterList['BD_PROJECT_VERSION'] = $scope.bdProjectVersion;
                }
                if ( $scope.bdRepoBranch) {
                $scope.parameterList['BD_REPO_BRANCH'] = $scope.bdRepoBranch;
                }
            }
            if ($scope.mcafeeScan) {
                $scope.parameterList['MCAFEE_SCAN'] = true;
            }
            if ($scope.trivyScan) {
                $scope.parameterList['TRIVY_SCAN'] = true;
            }
        }

    
        // Add parameters and their values to the list only if enableBuild is checked
        if ($scope.enableBuild) {
            if ($scope.buildSut) {
                $scope.parameterList['BUILD_SUT'] = $scope.buildSut;
            }

            if ($scope.commonReleaseTag) {
                $scope.parameterList['COMMON_RELEASE_TAG'] = $scope.commonReleaseTag;
            }
            if ($scope.buildAts !== undefined) {
                $scope.parameterList['BUILD_ATS'] = $scope.buildAts ? 'true' : 'false';
            }
            if ($scope.csar !== undefined) {
                $scope.parameterList['CSAR_BUILD'] = $scope.csar ? 'true' : 'false';
            }
            if ($scope.upgrade_charts !== undefined) {
                $scope.parameterList['UPGRADE_CHARTS'] = $scope.upgrade_charts ? 'true' : 'false';
            }
            if ($scope.overwrite_external_helm !== undefined) {
                $scope.parameterList['OVERWRITE_EXTERNAL_HELM'] = $scope.overwrite_external_helm ? 'true' : 'false';
            }
            if ($scope.build_config_snapshot !== undefined) {
                $scope.parameterList['BUILD_CONFIG_SNAPSHOT'] = $scope.build_config_snapshot ? 'true' : 'false';
            }

            if ($scope.pkg_scan !== undefined) {
                $scope.parameterList['PKG_SCAN'] = $scope.pkg_scan ? 'true' : 'false';
            }
            if ($scope.tpd !== undefined) {
                $scope.parameterList['TPD'] = $scope.tpd ? 'true' : 'false';
            }
            if ($scope.ignore_missing_services !== undefined) {
                $scope.parameterList['IGNORE_MISSING_SERVICES'] = $scope.ignore_missing_services ? 'true' : 'false';
            }

            $scope.appendPPBranchValues();

           
        }

        if ($scope.policyReleaseTag) {
            $scope.parameterList['POLICY_RELEASE_TAG'] = $scope.policyReleaseTag;
        }
        if ($scope.bsfReleaseTag) {
            $scope.parameterList['BSF_RELEASE_TAG'] = $scope.bsfReleaseTag;
        }

        if ($scope.atsPolicyReleaseTag && $scope.atsPolicyReleaseTag.trim() !== '') {
            $scope.parameterList['ATS_POLICY_RELEASE_TAG'] = $scope.atsPolicyReleaseTag;
        }
        if ($scope.atsBsfReleaseTag && $scope.atsBsfReleaseTag.trim() !== '') {
            $scope.parameterList['ATS_BSF_RELEASE_TAG'] = $scope.atsBsfReleaseTag;
        }

        if ($scope.test_atsBsfReleaseTag && $scope.test_atsBsfReleaseTag.trim() !== '') {
            $scope.parameterList['TEST_ATS_BSF_RELEASE_TAG'] = $scope.test_atsBsfReleaseTag;
        }

        if ($scope.enableBuild && $scope.buildAts) {

            if ($scope.atsBranch && $scope.atsBranch.trim() !== '') {
                $scope.parameterList['ATS_BRANCH'] = $scope.atsBranch;
            }
            if ($scope.atsFwBranch && $scope.atsFwBranch.trim() !== '') {
                $scope.parameterList['ATS_FW_BRANCH'] = $scope.atsFwBranch;
            }
            if ($scope.stubTagDiam && $scope.stubTagDiam.trim() !== '') {
                $scope.parameterList['STUB_TAG_DIAM'] = $scope.stubTagDiam;
            }
        }

        if ($scope.deployParams.CONTRACT_TEST !== undefined && $scope.deployParams.CONTRACT_TEST) {
            $scope.parameterList['CONTRACT_TEST'] = 'true';
        }
        
        if ($scope.deployParams.REPORT !== undefined && $scope.deployParams.REPORT) {
            $scope.parameterList['REPORT'] = 'true';
        }
        
        if ($scope.deployParams.INCLUDE_OCC_TEST !== undefined && $scope.deployParams.INCLUDE_OCC_TEST) {
            $scope.parameterList['INCLUDE_OCC_TEST'] = 'true';
        }


    // Add BUILD_ATS parameters if enabled and not empty

        // var nfType = $scope.nfType;
        // console.log("nfType:", nfType); // Log nfType value

        if ($scope.enableDeployment) {
            $scope.appendDeploymentValues(); // Pass nfType to the function
        }

        console.log($scope.parameterList);
    
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
    
    
});
