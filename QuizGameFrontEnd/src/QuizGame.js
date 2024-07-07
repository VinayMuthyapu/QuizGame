import React, { useState, useEffect } from 'react';
import { useTimer } from 'react-timer-hook';
import Toast from './Toast';

const questions = {
  Planets: [
    {
      question: "Name the planets in our solar system.",
      answers: ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto", "Ceres"]
    }
  ],
  "Programming Languages": [
    {
      question: "Name some programming languages.",
      answers: ["JavaScript", "Python", "Java", "C++", "C#", "Ruby", "PHP", "Swift", "Kotlin", "Go"]
    }
  ]
};

const QuizGame = () => {
  const [input, setInput] = useState("");
  const [revealedAnswers, setRevealedAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [question, setQuestion] = useState(null);
  const [time, setTime] = useState(null);

  const { seconds, isRunning, start, pause, resume, restart } = useTimer({
    expiryTimestamp: time,
    onExpire: () => {
      setToastMessage("Time's up!");
      setToastType("error");
    }
  });

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  useEffect(() => {
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');
      setInput(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };
  }, [recognition]);

  const handleTopicSelection = (topic) => {
    setSelectedTopic(topic);
    const selectedQuestion = questions[topic][0];
    setQuestion(selectedQuestion);
    setRevealedAnswers(Array(selectedQuestion.answers.length).fill(false));
    const newTime = new Date();
    newTime.setSeconds(newTime.getSeconds() + 60); // 1 minute timer
    setTime(newTime);
    restart(newTime);
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const fetchAnswerFromAPI = async (userInput) => {
    console.log("API call initiated with user input:", userInput);
    try {
      const response = await fetch('<URL for API call>', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_input: `[${question.answers.join(', ')}] from the above list of words which word is closely related to ${userInput}? answer in one word`
        })
      });
      const data = await response.json();
      console.log("API response received:", data);
      return data.response; // Adjusted based on the provided API response structure
    } catch (error) {
      console.error("Error fetching answer from API:", error);
      return null;
    }
  };

  const handleInputSubmit = async (e) => {
    e.preventDefault();
    recognition.stop();
    const answerIndex = question.answers.findIndex(
      answer => answer.toLowerCase() === input.trim().toLowerCase()
    );

    if (!isRunning) {
      setToastMessage("Time's up!");
      setToastType("error");
    } else if (answerIndex !== -1 && !revealedAnswers[answerIndex]) {
      const newRevealedAnswers = [...revealedAnswers];
      newRevealedAnswers[answerIndex] = true;
      setRevealedAnswers(newRevealedAnswers);
      setScore(score + 1);
      setToastMessage("Correct!");
      setToastType("success");
    } else {
      console.log("No exact match found, calling API...");
      const apiAnswer = await fetchAnswerFromAPI(input.trim());
      console.log("API Answer:", apiAnswer);
      const apiAnswerIndex = question.answers.findIndex(
        answer => answer.toLowerCase() === apiAnswer?.toLowerCase()
      );
      if (apiAnswerIndex !== -1 && !revealedAnswers[apiAnswerIndex]) {
        const newRevealedAnswers = [...revealedAnswers];
        newRevealedAnswers[apiAnswerIndex] = true;
        setRevealedAnswers(newRevealedAnswers);
        setScore(score + 1);
        setToastMessage("Correct!");
        setToastType("success");
      } else {
        setToastMessage("Incorrect answer or already revealed!");
        setToastType("error");
      }
    }
    setInput("");
  };

  const handleSpeechInput = () => {
    setInput("");
    setToastMessage("Speak Now \n click submit once done");
    setToastType("success");
    recognition.start();
  };

  const handleCloseToast = () => {
    setToastMessage("");
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      {selectedTopic ? (
        <>
          <div style={{ marginRight: '20px' }}>
            <h2>Time: {seconds}</h2>
          </div>
          <div style={{ textAlign: 'center' }}>
            <h1>{question.question}</h1>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {question.answers.map((answer, index) => (
                <li key={index}>{revealedAnswers[index] ? answer : "?"}</li>
              ))}
            </ul>
            <form onSubmit={handleInputSubmit}>
              <input
                type="text"
                value={input}
                onChange={handleInputChange}
                disabled={!isRunning}
              />
              <button type="submit" disabled={!isRunning}>Submit</button>
              <button type="button" onClick={handleSpeechInput} disabled={!isRunning}>Speak</button>
            </form>
            <h2>Score: {score}</h2>
          </div>
          <Toast message={toastMessage} type={toastType} onClose={handleCloseToast} />
        </>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <h1>Select a Topic</h1>
          <button onClick={() => handleTopicSelection("Planets")}>Planets</button>
          <button onClick={() => handleTopicSelection("Programming Languages")}>Programming Languages</button>
        </div>
      )}
    </div>
  );
};

export default QuizGame;