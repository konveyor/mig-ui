import React from 'react';
import { withFormik } from 'formik';
import { Flex, Box } from '@rebass/emotion';
import {
  Button,
  TextContent,
  TextList,
  TextListItem,
  TextArea,
} from '@patternfly/react-core';
import ConnectionState from '../../../common/connection_state';
import KeyDisplayIcon from '../../../common/components/KeyDisplayIcon';
import StatusIcon from '../../../common/components/StatusIcon';
import FormErrorDiv from './../../../common/components/FormErrorDiv';
import { css } from '@emotion/core';

class WrappedAddClusterForm extends React.Component<any, any> {
  state = {
    tokenHidden: true,
  };
  onHandleChange = (val, e) => {
    this.props.handleChange(e);
  }

  handleKeyToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    this.setState({
      tokenHidden: !this.state.tokenHidden,
    });
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.connectionState !== this.props.connectionState) {
      this.props.setFieldValue('connectionStatus', this.props.connectionState);
    }
  }

  render() {
    const {
      values,
      touched,
      errors,
      handleChange,
      handleBlur,
      handleSubmit,
      connectionState,
      setFieldTouched,
      setFieldValue,
    } = this.props;
    const dynamicTokenSecurity = this.state.tokenHidden ? 'disc' : 'inherit';
    return (
      <Flex>
        <form onSubmit={handleSubmit}>
          <Box>
            <TextContent>
              <TextList component="dl">
                <TextListItem component="dt">Cluster Name</TextListItem>
                <input
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name}
                  name="name"
                  type="text"
                />
                {errors.name && touched.name && (
                  <FormErrorDiv id="feedback-name">{errors.name}</FormErrorDiv>
                )}
                <TextListItem component="dt">Cluster URL</TextListItem>
                <input
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.url}
                  name="url"
                  type="text"
                />
                {errors.url && touched.url && (
                  <FormErrorDiv id="feedback-url">{errors.url}</FormErrorDiv>
                )}
                <TextListItem component="dt">
                  <Flex>
                    <Box flex="1" m="auto">
                      Service account token
                  </Box>
                    <Box flex="0 0 1em" m="auto">
                      <Button variant="plain" aria-label="Action" onClick={this.handleKeyToggle}>
                        <KeyDisplayIcon id="accessKeyIcon" isHidden={this.state.tokenHidden} />
                      </Button>
                    </Box>
                  </Flex>
                </TextListItem>
                <TextArea
                  value={values.token}
                  onChange={(val, e) => this.onHandleChange(val, e)}
                  onInput={() => setFieldTouched('token', true, true)}
                  onBlur={handleBlur}
                  name="token"
                  // isValid={!errors.accessKey && touched.accessKey}
                  id="token"
                  //@ts-ignore
                  css={css`
                    height: 5em !important;
                    -webkit-text-security: ${dynamicTokenSecurity};
                    -moz-text-security: ${dynamicTokenSecurity};
                    text-security: ${dynamicTokenSecurity};
                  `}
                />
                {errors.token && touched.token && (
                  <FormErrorDiv id="feedback-token">{errors.token}</FormErrorDiv>
                )}
              </TextList>
            </TextContent>
          </Box>
          <Box mt={20}>
            <Flex width="100%" m="20px 10px 10px 0" flexDirection="column">
              <Box>
                <Flex flexDirection="column" >
                  <Box alignSelf="flex-end">
                    <Button
                      key="check connection"
                      variant="secondary"
                      onClick={() => this.props.checkConnection()}
                    >
                      Check connection
                    </Button>
                  </Box>
                  <Box alignSelf="flex-end">
                    {renderConnectionState(connectionState)}
                  </Box>
                </Flex>

              </Box>
              <Box mt={30} alignSelf="flex-end">
                <Button
                  key="cancel"
                  variant="secondary"
                  onClick={() => this.props.onHandleModalToggle(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="secondary"
                  type="submit"
                  isDisabled={connectionState !== ConnectionState.Success}
                  style={{ marginLeft: '10px' }}
                >
                  Add
                </Button>
              </Box>
            </Flex>
          </Box>
        </form>
      </Flex>
    );

  }
}

function renderConnectionState(connectionState: ConnectionState) {
  let cxStateContents;
  let iconStatus;

  switch (connectionState) {
    case ConnectionState.Checking:
      cxStateContents = 'Checking...';
      iconStatus = 'checking';
      break;
    case ConnectionState.Success:
      cxStateContents = 'Success!';
      iconStatus = 'success';
      break;
    case ConnectionState.Failed:
      cxStateContents = 'Failed!';
      iconStatus = 'failed';
      break;
  }

  return (
    <Flex m="10px 10px 10px 0">
      <Box>
        {cxStateContents}
        {' '}
        <StatusIcon status={iconStatus} />
      </Box>
    </Flex>
  );
}

const AddClusterForm: any = withFormik({
  mapPropsToValues: () => ({ name: '', url: '', token: '', connectionStatus: '' }),

  validate: values => {
    const errors: any = {};

    if (!values.name) {
      errors.name = 'Required';
    }

    if (!values.url) {
      errors.url = 'Required';
    }

    if (!values.token) {
      errors.token = 'Required';
    }

    return errors;
  },

  handleSubmit: (values, formikBag: any) => {
    formikBag.setSubmitting(false);
    formikBag.props.onHandleModalToggle();
    formikBag.props.onAddItemSubmit(values);
  },

  displayName: 'Add Cluster Form',
})(WrappedAddClusterForm);

export default AddClusterForm;
