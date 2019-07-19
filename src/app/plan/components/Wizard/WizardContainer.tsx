import { withFormik } from 'formik';
import WizardComponent from './WizardComponent';
import planOperations from '../../duck/operations';
import { connect } from 'react-redux';
import utils from '../../../common/duck/utils';

const WizardContainer: any = withFormik({
  mapPropsToValues: () => ({
    connectionStatus: '',
    planName: '',
    sourceCluster: null,
    targetCluster: null,
    selectedNamespaces: [],
    selectedStorage: '',
    persistentVolumes: [],
  }),

  validate: values => {
    const errors: any = {};

    if (!values.planName) {
      errors.planName = 'Required';
    } else if (!utils.testDNS1123(values.planName)) {
      errors.planName = utils.DNS1123Error(values.planName);
    }
    if (!values.sourceCluster) {
      errors.sourceCluster = 'Required';
    }
    if (!values.selectedNamespaces || values.selectedNamespaces.length === 0) {
      errors.selectedNamespaces = 'Required';
    }
    if (!values.targetCluster) {
      errors.targetCluster = 'Required';
    }
    if (!values.selectedStorage) {
      errors.selectedStorage = 'Required';
    }
    return errors;
  },

  handleSubmit: (values, formikBag: any) => {
    formikBag.setSubmitting(false);
    formikBag.props.onPlanSubmit(values);
  },
  validateOnBlur: false,
})(WizardComponent);

const mapStateToProps = state => {
  const allSourceClusterNamespaces = state.plan.sourceClusterNamespaces;
  const filteredSourceClusterNamespaces = allSourceClusterNamespaces.filter(ns => {
    const rejectedRegex = [
      RegExp('^kube-.*', 'i'),
      RegExp('^openshift-.*', 'i'),
      RegExp('^openshift$', 'i'),
      RegExp('^velero$', 'i'),
      RegExp('^default$', 'i'),
    ];

    // Short circuit the regex check if any of them match a rejected regex and filter it out
    return !rejectedRegex.some(rx => rx.test(ns.metadata.name));
  });

  return {
    connectionStatus: '',
    planName: '',
    sourceCluster: null,
    targetCluster: null,
    selectedNamespaces: [],
    selectedStorage: '',
    persistentVolumes: [],
    isCheckingPlanStatus: state.plan.isCheckingPlanStatus,
<<<<<<< HEAD
    isFetchingNamespaceList: state.plan.isFetchingNamespaceList,
    sourceClusterNamespaces: filteredSourceClusterNamespaces,
=======
    isFetchingPVList: state.plan.isFetchingPVList,
>>>>>>> wip storage class
    isPVError: state.plan.isPVError,
    isFetchingStorageClasses: state.plan.isFetchingStorageClasses,
    isStorageClassError: state.plan.isStorageClassError,
    storageClassList: state.plan.storageClassList,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    addPlan: plan => dispatch(planOperations.addPlan(plan)),
<<<<<<< HEAD
    fetchNamespacesForCluster: clusterName => {
      dispatch(planOperations.fetchNamespacesForCluster(clusterName));
    },

    pvFetchRequest: () => dispatch(planOperations.pvFetchRequest()),
=======
    storageClassFetch: () => dispatch(planOperations.storageClassFetch()),
>>>>>>> wip storage class
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WizardContainer);
