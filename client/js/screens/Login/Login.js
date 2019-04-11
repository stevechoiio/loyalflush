import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { Form, Field } from "react-final-form";
import styles from "./styles";
import { graphql, compose } from "react-apollo";
import {
  AUTHENTICATE_USER,
  SIGNUP_USER,
  UPDATE_SIGNEDUPUSER
} from "../../config/queries";
import { Input, Button } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";

class LogIn extends Component {
  constructor(props) {
    super(props);
    this.state = { text: "", loading: false, login: true, gender: null };
  }
  static navigationOptions = {
    title: "Please sign in"
  };

  validate = values => {
    const errors = {};
    if (!values.email || values.email === "") {
      errors.email = "Email is required";
    } else if (/.*@.*\..*/.test(values.email) === false) {
      errors.email = "The email format is invalid";
    }
    if (!values.password) {
      errors.password = "Password is required";
    }
    return errors;
  };

  render() {
    return (
      <View style={styles.container}>
        <Form
          onSubmit={async value => {
            try {
              if (this.state.login) {
                this.setState({ loading: true });
                const result = await this.props.loginMutation({
                  variables: { email: value.email, password: value.password }
                });

                const user = result.data.authenticateUser;

                await AsyncStorage.setItem("userToken", user.token);
                await AsyncStorage.setItem("id", user.id);

                console.log("In Login - Before navigate to Activities");
              } else {
                console.log(value);
                const result = await this.props.signupMutation({
                  variables: { email: value.email, password: value.password }
                });
                const user = result.data.signupUser;
                const updatedUser = await this.props.updateSignedupUserMutation(
                  {
                    variables: {
                      id: user.id,
                      name: value.name,
                      gender: this.state.gender
                    }
                  }
                );
                console.log(updatedUser);
              }

              this.props.navigation.navigate("Account");
            } catch (e) {
              console.log(e);
            }
          }}
          validate={this.validate}
          render={({
            handleSubmit,
            pristine,
            invalid,
            hasSubmitErrors,
            submitError,
            form
          }) => (
            <View style={styles.flexContent}>
              <Text style={styles.text}>Log In</Text>
              <Field name="email">
                {({ input, meta }) => (
                  <Input
                    placeholder="e-mail"
                    {...input}
                    onChangeText={text => this.setState({ text })}
                    leftIcon={{ type: "font-awesome", name: "chevron-left" }}
                  />
                )}
              </Field>
              {!this.state.login ? (
                <Field name="name">
                  {({ input, meta }) => (
                    <Input
                      placeholder="full name"
                      {...input}
                      onChangeText={text => this.setState({ text })}
                    />
                  )}
                </Field>
              ) : null}

              <Field name="password">
                {({ input, meta }) => (
                  <Input
                    editable={true}
                    {...input}
                    placeholder="password"
                    secureTextEntry={true}
                    onChangeText={text =>
                      this.setState({ originalPassword: text })
                    }
                  />
                )}
              </Field>
              {!this.state.login ? (
                <Field name="confirmpassword">
                  {({ input, meta }) => (
                    <Input
                      placeholder="confirm password"
                      secureTextEntry={true}
                    />
                  )}
                </Field>
              ) : null}
              {!this.state.login ? (
                <View>
                  <Button
                    onPress={() => {
                      this.setState({ gender: "male" });
                    }}
                    type={this.state.gender === "male" ? "solid" : "clear"}
                    icon={<Icon name="male" size={30} />}
                  />
                  <Button
                    onPress={() => {
                      this.setState({ gender: "female" });
                    }}
                    type={this.state.gender === "female" ? "solid" : "clear"}
                    icon={<Icon name="female" size={30} />}
                  />
                </View>
              ) : null}
              <TouchableOpacity
                onPress={() => {
                  console.log("pressed");
                  this.setState({ login: !this.state.login });
                }}
              >
                {this.state.login ? (
                  <Text>new user?</Text>
                ) : (
                  <Text>already have an account?</Text>
                )}
              </TouchableOpacity>

              {!pristine && !invalid ? (
                <TouchableOpacity
                  onPress={handleSubmit}
                  disabled={pristine || invalid}
                  style={styles.button}
                >
                  {this.state.loading ? (
                    <ActivityIndicator />
                  ) : (
                    <Text style={styles.buttonText}>Log In</Text>
                  )}
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => {}}
                  disabled={pristine || invalid}
                  style={styles.disabled}
                >
                  <Text style={styles.buttonText}>
                    {this.state.login ? "Log In" : "Sign Up"}
                  </Text>
                </TouchableOpacity>
              )}
              {hasSubmitErrors && (
                <Text style={styles.errorMessage}>{submitError}</Text>
              )}
            </View>
          )}
        />
      </View>
    );
  }
}

export default compose(
  graphql(AUTHENTICATE_USER, { name: "loginMutation" }),
  graphql(SIGNUP_USER, { name: "signupMutation" }),
  graphql(UPDATE_SIGNEDUPUSER, { name: "updateSignedupUserMutation" })
)(LogIn);
