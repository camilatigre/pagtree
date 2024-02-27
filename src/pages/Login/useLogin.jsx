import { useState } from 'react';
import { validateFields } from '../../utils/validateFields';
import { loginApi } from '../../api/api';
import { useNavigate } from 'react-router-dom';
import { useDispatch} from 'react-redux';
import { saveAuth } from '../../slicers/Auth/slicer'

const useLogin = (initialValues) => {
  const [credentials, setCredentials] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleInputChange = (event) => {
    setCredentials({
      ...credentials,
      [event.target.name]: event.target.value,
    });
    setErrors({});
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (validateFields(credentials, setErrors)) return;

    setIsLoading(true);

    try {
      const response = await loginApi(credentials);
      dispatch(saveAuth(response))
      navigate('/merchants');

    } catch (error) {
      setIsLoading(false);
      const errorData = await error.response?.json();
      setErrors(extractPropertyErrors(errorData));
    }
  };

  const extractPropertyErrors = (errorData) => {
    const errors = {};
    if (errorData && errorData.errors) {
      for (const field in errorData.errors) {
        errors[field] = errorData.errors[field].join(', ');
      }
    } else if (errorData && errorData.message) {
      errors._general = errorData.message; // Set a general error message
    }
    return errors;
  };

  return {
    credentials,
    errors,
    isLoading,
    handleInputChange,
    handleSubmit,
  };
};

export default useLogin;