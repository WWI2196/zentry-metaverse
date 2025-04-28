import React from 'react'

const BentoTilt = ({children, className=''}) => {

  const [transaformStyle, setTransformStyle] = useState('');
  const itemRef = useRef(null);
  
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = itemRef.current.getBoundingClientRect();
    const x = ((clientX - left) / width) * 2 - 1;
    const y = ((clientY - top) / height) * 2 - 1;
    setTransformStyle(`rotateY(${x * 10}deg) rotateX(${y * -10}deg)`);
  };

  const handleMouseLeave = () => {
    setTransformStyle('rotateY(0deg) rotateX(0deg)');
  }

  return (
    <div className={className} ref={itemRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
       
    </div>
  )
}

export default BentoCard