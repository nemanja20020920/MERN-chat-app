import {
  Button,
  FormControl,
  FormErrorMessage,
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

const Register = () => {
  //State
  const [show, setShow] = useState(false);

  //Hooks
  const toast = useToast();
  const navigate = useNavigate();

  //Validators
  const validateFirstName = (value) => {
    const trimmed = value.trim();
    if (!trimmed) return 'First Name is required!';
    else if (trimmed.length < 2)
      return 'First Name should be at least 3 characters long!';
    else if (trimmed.length > 20)
      return 'First Name should be less than 21 characters long!';
    return null;
  };

  const validateLastName = (value) => {
    const trimmed = value.trim();
    if (!trimmed) return 'Last Name is required!';
    else if (trimmed.length < 2)
      return 'Last Name should be at least 3 characters long!';
    else if (trimmed.length > 20)
      return 'Last Name should be less than 21 characters long!';
    return null;
  };

  const validateEmail = (value) => {
    const trimmed = value.trim();

    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(trimmed))
      return 'Enter a valid email address e.g. someone@email.com';
    return null;
  };

  const validatePassword = (value) => {
    const trimmed = value.trim();

    if (!trimmed) return 'Password is required!';
    else if (trimmed.length < 4)
      return 'Password should be at least 4 characters long!';
    else if (trimmed.length > 20)
      return 'Password should be less than 21 characters long!';
    return null;
  };

  //Submit
  const submitHandler = async (values) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/register`,
        {
          ...values,
        },
        config
      );

      localStorage.setItem('userData', JSON.stringify(data));
      navigate('/home');
      toast({
        title: 'Register success!',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    } catch (error) {
      toast({
        title: 'An Error Occured!',
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
            firstName: '',
            lastName: '',
            email: '',
            password: '',
          }}
          onSubmit={submitHandler}
        >
          {(props) => (
            <Form style={{ width: '80%' }}>
              <Field name="firstName" type="text" validate={validateFirstName}>
                {({ field, form }) => (
                  <FormControl
                    isInvalid={form.errors.firstName && form.touched.firstName}
                    my={2}
                  >
                    <FormLabel>First Name</FormLabel>
                    <Input {...field} />
                    <FormErrorMessage>{form.errors.firstName}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="lastName" type="text" validate={validateLastName}>
                {({ field, form }) => (
                  <FormControl
                    isInvalid={form.errors.lastName && form.touched.lastName}
                    my={2}
                  >
                    <FormLabel>Last Name</FormLabel>
                    <Input {...field} />
                    <FormErrorMessage>{form.errors.lastName}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="email" type="text" validate={validateEmail}>
                {({ field, form }) => (
                  <FormControl
                    isInvalid={form.errors.email && form.touched.email}
                    my={2}
                  >
                    <FormLabel>Email address</FormLabel>
                    <Input {...field} />
                    <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="password" validate={validatePassword}>
                {({ field, form }) => (
                  <FormControl
                    isInvalid={form.errors.password && form.touched.password}
                    my={2}
                  >
                    <FormLabel>Password</FormLabel>
                    <InputGroup size="md">
                      <Input
                        {...field}
                        pr="4.5rem"
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
                    <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Button
                variant="solid"
                colorScheme="gray"
                my={5}
                type="submit"
                isLoading={props.isSubmitting}
              >
                Register
              </Button>
              <Text alignSelf="self-start">
                Already have an account? Login{' '}
                <Link style={{ textDecoration: 'underline' }} to={'/'}>
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

export default Register;
