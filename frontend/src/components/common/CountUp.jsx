import ReactCountUp from 'react-countup';

// In Vite with some CommonJS packages, the default export is sometimes wrapped in an object.
// This wrapper ensures we get the correct component.
const CountUpComponent = ReactCountUp.default || ReactCountUp;

export default function CountUp(props) {
  return <CountUpComponent {...props} />;
}
