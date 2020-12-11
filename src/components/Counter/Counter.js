import { useState, useEffect } from 'react';
import * as PropTypes from 'prop-types';
import { animate, cubicBezier } from 'popmotion';

const Counter = ({
  children, duration, start, end
}) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const playback = animate({
      from: start ?? 0,
      to: end ?? 0,
      duration: duration ? duration * 1000 : 1000,
      // elapsed: 500,
      ease: cubicBezier(0.3, 1, 0, 1),
      onUpdate: (latest) => setValue(latest)
    });

    return playback.stop;
  }, [duration, start, end]);

  return children({ value });
};

Counter.propTypes = {
  children: PropTypes.func.isRequired,
  start: PropTypes.number,
  end: PropTypes.number,
  duration: PropTypes.number,
};

export default Counter;
