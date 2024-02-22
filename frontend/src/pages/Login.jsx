import {
  Button,
  FormControl,
  FormLabel,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import image from '../assets/img/background.png';
import { Field, Form, Formik } from 'formik';
import axios from 'axios';
import { API_URL } from '../config';

const Login = () => {
  //State
  const [show, setShow] = useState(false);

  //hooks
  const toast = useToast();
  const navigate = useNavigate();

  //Submit
  const submitHandler = async (values) => {
    if (!values.email.trim() || !values.password.trim()) return;

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const { data } = await axios.post(
        `${API_URL}/users/login`,
        {
          ...values,
        },
        config
      );

      localStorage.setItem('userData', JSON.stringify(data));
      navigate('/home');
      toast({
        title: 'Login success',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'An Error Occured',
        description: error.response.data.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    }
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Image
        display={{ base: 'none', md: 'block' }}
        height="100vh"
        width={{ base: '50%', xl: '70%' }}
        src={image}
      />
      <VStack
        bgColor="white"
        textAlign="center"
        padding="0px 20px"
        flexBasis={{ base: '100%', md: '50%', xl: '30%' }}
        margin="0 auto !important"
      >
        <Text
          color="rgb(0, 0, 0)"
          fontSize={100}
          mb={5}
          p={1}
          borderRadius={5}
          margin="0 auto 20px auto"
        >
          NCHAT
        </Text>
        <Formik
          initialValues={{
            email: '',
            password: '',
          }}
          onSubmit={submitHandler}
        >
          {(props) => (
            <Form style={{ width: '80%' }}>
              <Field name="email" type="text">
                {({ field }) => (
                  <FormControl>
                    <FormLabel>Email address</FormLabel>
                    <Input {...field} />
                  </FormControl>
                )}
              </Field>
              <Field name="password">
                {({ field }) => (
                  <FormControl>
                    <FormLabel>Password</FormLabel>
                    <InputGroup size="md">
                      <Input
                        pr="4.5rem"
                        {...field}
                        type={show ? 'text' : 'password'}
                      />
                      <InputRightElement width="4.5rem">
                        <Button
                          size="sm"
                          onClick={() => setShow((prevVal) => !prevVal)}
                        >
                          {show ? 'Hide' : 'Show'}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>
                )}
              </Field>
              <Button
                variant="solid"
                colorScheme="gray"
                my={5}
                isLoading={props.isSubmitting}
                type="submit"
              >
                Login
              </Button>
              <Text alignSelf="self-start">
                Don&apos;t have an account yet? Register{' '}
                <Link style={{ textDecoration: 'underline' }} to={'/register'}>
                  here.
                </Link>
              </Text>
            </Form>
          )}
        </Formik>
      </VStack>
    </div>
  );
};

export default Login;
