import { useNavigation } from 'react-router';

const SubmitBtn = ({ text, disabled }) => {
    const navigation = useNavigation();
    const isSubmitting = navigation.state === 'submitting';
    const isDisabled = disabled || isSubmitting;
    
    return (
      <button 
        type="submit" 
        className={`btn btn-block font-bold py-3 rounded-lg transition-all duration-200 ${
          isDisabled 
            ? 'bg-gray-300 text-gray-500 cursor-default' 
            : 'btn-accent cursor-pointer hover:bg-accent-focus'
        }`}
        disabled={isDisabled}
      >
        {isSubmitting ? (
          <>
            <span className="loading loading-spinner"></span>
            sending...
          </>
        ) : (
          text || 'submit'
        )}
      </button>
    );
  };
  

export default SubmitBtn;