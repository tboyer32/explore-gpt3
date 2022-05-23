import React from 'react';
import 'normalize.css';
import './styles.css';
import loadingImg from './images/simpleloading.gif'

function App() {
  //hardcode some premade prompts
  const promptList = [
    "Who's your favorite basketball player and why?",
    "What are some things you can do in less than thirty seconds?",
    "Tell me about the history of art",
    "Write a story about a cat named Charlie",
    "Give me an idea for a pet app",
    "Make me a grocery list",
    "What are three things I should know about Javascript?",
    "Explain gravity like I'm five",
    "What food would you use to prop a book open and why?",
    "Write a listacle about productivity"
  ]

  //setting initial state
  const [gpt3Responses, setgpt3Responses] = React.useState(
    JSON.parse(localStorage.getItem('gpt3Responses')) || []
  );
  const [loading, setLoading] = React.useState(false);

  //getting the textarea
  const prompt = React.useRef();
  
  //handle form submission
  const handleSubmit = e => {
    e.preventDefault();
    setLoading(true);
    const user_prompt = prompt.current.value;
    const data ={
      "prompt": user_prompt,
      "temperature": 0.8,
      "max_tokens": 150,
      "top_p": 1,
      "frequency_penalty": 1,
      "presence_penalty": 1
    }
    fetch('https://api.openai.com/v1/engines/text-davinci-002/completions', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.REACT_APP_API_KEY
      }
    })
    .then(res => res.json())
    .then(resultData => {
      //empty the textarea after submission
      prompt.current.value = '';
      //get the data from the response
      const responseText = resultData['choices'][0]['text'];
      const formattedText = responseText.substring(responseText.lastIndexOf("\n")+1);
      const newResult = {
        'prompt': user_prompt,
        'response': formattedText
      }
      //get the items already in local storage
      const currentResults = [...gpt3Responses];
      //add our new result to the beginning
      currentResults.unshift(newResult);
      //set state
      setgpt3Responses(currentResults);
      setLoading(false);
      
      //add to local storage
      localStorage.setItem('gpt3Responses', JSON.stringify(currentResults));
    });
  };

  const handleClick = () => {
    const randIndex = Math.floor(Math.random() * 10);
    prompt.current.value = promptList[randIndex];
  }

  return (
    <>
      <header>
        <form onSubmit={handleSubmit}>
          <label htmlFor="prompt">Enter a prompt:</label>
          <textarea id="prompt" ref={prompt}></textarea>
          <a id="get-random" onClick={handleClick}>Generate Random Prompt</a>
          <input name="submit" id="submit" type="submit" />
        </form>
      </header>
      <p>Unfortunately OpenAI is shutting down my API keys, despite them being hidden with gitignore.</p>
    
      {loading ? <img id="loading" src={loadingImg} /> : <img id="loading" className="hide" src={loadingImg} />}

      {gpt3Responses.map((item, i) => (
        <section key={i}>
          <p><strong>Prompt: </strong>{item.prompt}</p>
          <p><strong>Response: </strong>{item.response}</p>
        </section>
      ))}
    </>
  );
}

export default App;
