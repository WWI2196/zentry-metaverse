import AnimatedTitle from "./AnimatedTitle";
import Button from "./Button";

const ImageClipBox = ({ src, clipClass }) => (
  <div className={clipClass}>
    <img src={src} />
  </div>
);

const Contact = () => {
  return (
    <div id="contact" className="relative my-20 min-h-96 w-screen px-10">
      <div className="absolute -top-40 left-1/2 z-30 w-60 -translate-x-1/2 sm:left-auto sm:right-10 sm:top-[-10rem] sm:translate-x-0 md:right-10 lg:-top-24 lg:right-20 lg:w-80">
        <ImageClipBox
          src="/img/swordman-partial.webp"
          clipClass="absolute md:scale-125" // Keep partial image absolute within this container
        />
        <ImageClipBox
          src="/img/swordman.webp"
          clipClass="sword-man-clip-path md:scale-125"
        />
      </div>

      {/* Inner black container - Added overflow-visible to be explicit */}
      <div className="relative overflow-visible rounded-lg bg-black py-24 text-blue-50">
        {/* Left side images */}
        <div className="absolute -left-20 top-0 hidden h-full w-72 overflow-hidden sm:block lg:left-20 lg:w-96">
          <ImageClipBox
            src="/img/contact-1.webp"
            clipClass="contact-clip-path-1"
          />
          <ImageClipBox
            src="/img/contact-2.webp"
            clipClass="contact-clip-path-2 lg:translate-y-40 translate-y-60"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col items-center text-center">
          <p className="mb-10 font-general text-[10px] uppercase">
            Join Zentry
          </p>

          {/* Changed <br /> to <br> in the title prop */}
          <AnimatedTitle
            title="let's b<b>u</b>ild the <br> new era of <br> g<b>a</b>ming t<b>o</b>gether."
            className="special-font !md:text-[6.2rem] w-full font-zentry !text-5xl !font-black !leading-[.9]"
          />

          <Button title="contact us" containerClass="mt-10 cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default Contact;