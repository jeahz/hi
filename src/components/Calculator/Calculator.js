import {useState} from 'react';
import './Calculator.css'

const Calculator = () => {
    const [count, setCount] = useState(null);
    const [display, setDisplay] = useState('0');
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [operator, setOperator] = useState('');
    const [isDecimal, setIsDecimal] = useState(false);
    const [isInputDecimal, setIsInputDecimal] = useState(false);
    const computePrevious = {
      add: () => {
        if(operator === 'add') {
              setCount((count) => Math.round((Number(count) + Number(input))*10000)/10000);
            }
      },
      subtract: () => {
        if(operator === 'subtract') {
              setCount((count) => Math.round((Number(count) - Number(input))*10000)/10000);
            }
      },
      multiply: () => {
        if(operator === 'multiply') {
              setCount((count) => Math.round((Number(count) * Number(input))*10000)/10000);
            } 
      }, 
      divide: () => {
        if(operator === 'divide') {
              setCount((count) => Math.round((Number(count) / Number(input))*10000)/10000);
            }
      }
    }
    
    const handleClick = (e) => {
      if(e.target.id === 'clear') {
          setCount(null);
          setInput('');
          setOutput('');
          setDisplay('0'); 
          setOperator('');
          setIsDecimal(false);
          setIsInputDecimal(false);
        }
        else if(e.target.id === 'zero'){
          // no multi leading zero
           if((!operator && input[0] !== undefined) || (operator && input[0] !== '0') ||  isInputDecimal || output){
             if(output) {
               if(isDecimal) {
               setInput(`${output}.${e.target.innerText}`);
               setDisplay((display) => `${output}.${e.target.innerText}`);
               setIsDecimal(false);
               } else {
                 setInput(`${output}.${e.target.innerText}`);
               setDisplay((display) => `${output}.${e.target.innerText}`);
               }
               setCount(null);
               setOutput('');
             } else {
               if(isDecimal) {
                 setInput((input) => `${Number(input)}.${e.target.innerText}`);
                 setIsDecimal(false);
               } else {
             setInput((input) => `${input}${e.target.innerText}`);
             }
               setDisplay((display) => `${display}${e.target.innerText}`);
             }
           }
        }
        else if(e.target.id === 'one' || e.target.id === 'two' || e.target.id === 'three'|| e.target.id === 'four' || e.target.id === 'five' || e.target.id === 'six' || e.target.id === 'seven' || e.target.id === 'eight' || e.target.id === 'nine') {
          if(output) {
            if(isDecimal) {
              setInput(`${output}.${e.target.innerText}`);
              setDisplay((display) => `${display}${e.target.innerText}`);
              setIsDecimal(false);
            } else {
            setInput(`${output}${e.target.innerText}`);
            setDisplay((display) => `${display}${e.target.innerText}`);
            }
            setOutput('');
            setCount(null);
          } else {
          if(operator === '') {
          if(isDecimal) {
            setDisplay((display) => `${display}${e.target.innerText}`);
            setInput((input) => `${Number(input)}.${e.target.innerText}`);
            setIsDecimal(false);
          } else {
              setDisplay((display) => `${input}${e.target.innerText}`);
             setInput((input) => `${input}${e.target.innerText}`);
          }
          }
          else if(operator === 'add' || operator === 'multiply' || operator === 'divide' || operator === 'subtract') {
            if(isDecimal) {
              setDisplay((display) => `${display}${e.target.innerText}`);
              
              if((`${input}`.match(/-/g)  || []).length === 1) {
              setInput((input) => `${(input)}.${e.target.innerText}`);
              } else {
                setInput((input) => `${Number(input)}.${e.target.innerText}`);
              }
              setIsDecimal(false);
            } else {
              setDisplay((display) => `${display}${e.target.innerText}`);
             setInput((input) => `${input}${e.target.innerText}`);
            }
          }
          }
        }
        else if(e.target.id === 'add') {
          if(operator !== '' && operator !== 'add' && (input === '' || input === '-')) {
             setDisplay((display) => display.replace(/[\s-+/x]+$/g, ` + `));
          } else {
          if(operator !== 'add' && operator !== '') {
            computePrevious.subtract();
            computePrevious.multiply();
            computePrevious.divide();
          } else {
          if(output) {
            setCount(output); 
            setOutput('');
          }
          else {
            setCount((count) => Math.round((Number(count) + Number(input))*10000)/10000);
          }
          }
          if(`${display}`.match(/\+\s$/g) === null) { 
            setDisplay((display) => `${display} + `);
          }
          }
          setIsInputDecimal(false);
          setOperator('add');
          setInput('');
        }
        else if(e.target.id === 'subtract') {
          // if there is another operator and input isn't empty and not minus
          if(operator !== '' && operator !== 'subtract' && input !== '' && input !== '-') {
            computePrevious.add();
            computePrevious.multiply();
            computePrevious.divide();
            setInput('');
            setOperator('subtract');
            if(`${display}`.match(/-\s$/g) === null ) {
            setDisplay((display) => `${display} - `);
          }
          } 
          else {
          if(output !== '') {
            setCount(output);
            setOutput('');
            setOperator('subtract');
            if(`${display}`.match(/-\s$/g) === null ) {
            setDisplay((display) => `${display} - `);
          }
          }
          else {
            if(`${input}`.match(/[1-9]/g) !== null) {
            count === null && setCount(Number(input));
            count !== null && setCount((count) => Math.round((Number(count) - Number(input))*10000)/10000);
            setInput('');
            }
            if((((`${input}`.match(/-/g)  || []).length < 1) && operator !== '' && input === '')) {
            if(operator === 'subtract') {
            setDisplay((display) => `${display} - `);
            }
            setInput(`-`);
          }
          if(((`${input}`.match(/-/g) || []).length < 1) && input === '' && operator === '') {
            setInput(`-`);
            setDisplay(`-`);
          } else if (`${input}`.match(/-$/g) !== null) {
          } else if(`${display}`.match(/-\s$/g) === null ) {
            setDisplay((display) => `${display} - `);
            if(operator !== 'subtract' && input !== '' ) {
            setOperator('subtract');
            }
          }
          }
          }
          setIsInputDecimal(false);
        }
        else if(e.target.id === 'multiply') {
          if(operator !== '' && operator !== 'multiply' && (input === '' || input === '-')) {
             setDisplay((display) => display.replace(/[\s\-+/\x]+$/g, ` x `));
          } else {
          if(operator !== '' && operator !== 'multiply') {
            computePrevious.add();
            computePrevious.subtract();
            computePrevious.divide();
          } else {
            if(output) {
            setCount(output);
            setOutput('');
          }
          else {
            count && setCount((count) => Math.round((Number(count) * Number(input))*10000)/10000);
            !count && setCount(Number(input));
          }
          }
          if(`${display}`.match(/\x\s$/g) === null) {
            setDisplay((display) => `${display} x `);
          }
          }
          setIsInputDecimal(false);
          setOperator('multiply');
          setInput('');
        }
        else if(e.target.id === 'divide') {
          if(operator !== '' && operator !== 'divide' && (input === '' || input === '-')) {
             setDisplay((display) => display.replace(/[\s\-+/\x]+$/g, ` / `));
          } else {
          if(operator !== '' && operator !== 'divide') {
            computePrevious.add();
            computePrevious.subtract();
            computePrevious.multiply();
          } else {
            if(output) {
            setCount(output); 
            setOutput('');
          }
          else {
            count && setCount((count) => Math.round((Number(count) / Number(input))*10000)/10000);
            !count && setCount(Number(input));
          }
          }
          if(`${display}`.match(/\/\s$/g) === null) {
            setDisplay((display) => `${display} / `);
          }
          }
          setIsInputDecimal(false);
          setOperator('divide');
          setInput('');
        }
        else if(e.target.id === 'equals') {
          if(input && (`${input}`.match(/^-$/g) === null)) {
          if(operator === 'add') {
              setOutput(Math.round((Number(count) + Number(input))*10000)/10000);
              input && setDisplay(`${Math.round((Number(count) + Number(input))*10000)/10000}`)
          }
          else if(operator === 'subtract') {
              setOutput(Math.round((Number(count) - Number(input))*10000)/10000);
              input && setDisplay(`${Math.round((Number(count) - Number(input))*10000)/10000}`); 
          }
          else if(operator === 'divide') {
              setOutput(Math.round((Number(count) / Number(input))*10000)/10000);
              input && setDisplay(`${Math.round((Number(count) / Number(input))*10000)/10000}`);
          }
          else if(operator === 'multiply') {
              setOutput(Math.round((Number(count) * Number(input))*10000)/10000);
              setDisplay(`${Math.round((Number(count) * Number(input))*10000)/10000}`);
          }
          setInput(''); 
          setOperator('');
          setIsInputDecimal(false);
        } else {console.log('input has minus and hasn`t number')} 
      } else if(e.target.id === 'decimal'){
        if((!output && !isInputDecimal) || (output && `${output}`.match(/\./g) === null)) {
        if(output) {
          setInput(`${output}`);
          setDisplay(`${output}.`);
        } else {
          if(input === '' && Number(display) !== 0) {
            setDisplay((display) => `${display}0.`);
          } else {
            setDisplay(`${display}.`);
          }
        }
        setIsDecimal(true);
        setIsInputDecimal(true);
        } else {console.log('input has minus and hasn`t any number')} 
      }
    }
    
    return (
      <>
      <div className="calc-container">
      <div id="calculator">
      <div id="display-calc">{display}</div>
      <div id="button-area">
      <button id="clear" onClick={handleClick}>AC</button>
      <button id="divide" onClick={handleClick}>/</button>
      <button id="multiply" onClick={handleClick}>x</button>
      <button id="seven" onClick={handleClick}>7</button>
      <button id="eight" onClick={handleClick}>8</button>
      <button id="nine" onClick={handleClick}>9</button>
      <button id="subtract" onClick={handleClick}>-</button>
      <button id="four" onClick={handleClick}>4</button>
      <button id="five" onClick={handleClick}>5</button>
      <button id="six" onClick={handleClick}>6</button>
      <button id="add" onClick={handleClick}>+</button>
      <button id="one" onClick={handleClick}>1</button>
      <button id="two" onClick={handleClick}>2</button>
      <button id="three" onClick={handleClick}>3</button>
      <button id="equals" onClick={handleClick}>=</button>
      <button id="zero" onClick={handleClick}>0</button>
      <button id="decimal" onClick={handleClick}>.</button>
      </div>
      </div>
      </div>
      </>
      )
  }

  export default Calculator;