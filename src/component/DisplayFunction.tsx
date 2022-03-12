interface DisplayFunctionProps {
  countUp: () => void;
  objCountUp: () => void;
  listCountUp: () => void;
}

export const DisplayFunction: React.FC<DisplayFunctionProps> = ({
  countUp,
  objCountUp,
  listCountUp,
}) => (
  <div className='text-primary-800'>
    <h2>パターン４　countUp: () =&gt; void, etc...</h2>
    <div className='flex gap-x-3'>
      <button
        onClick={countUp}
        className='rounded bg-primary-800 px-2 py-1 text-white hover:opacity-70'
      >
        countUp()
      </button>
      <button
        onClick={objCountUp}
        className='rounded bg-primary-800 px-2 py-1 text-white hover:opacity-70'
      >
        objCountUp()
      </button>
      <button
        onClick={listCountUp}
        className='rounded bg-primary-800 px-2 py-1 text-white hover:opacity-70'
      >
        listCountUp()
      </button>
    </div>
  </div>
);
