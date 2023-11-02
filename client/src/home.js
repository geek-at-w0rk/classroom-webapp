import React, { useState } from 'react';
import './homeStyle.css';
import axios from 'axios';

const Home = () => {
  const [showForm, setShowForm] = useState(false);
  const [teacherEmail, setTeacherEmail] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentEmails, setStudentEmails] = useState([]);
  const [classDate, setClassDate] = useState('');
  const [classTime, setClassTime] = useState('');

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const handleTeacherEmailChange = (e) => {
    setTeacherEmail(e.target.value);
  };

  const handleStudentEmailChange = (e) => {
    setStudentEmail(e.target.value);
  };

  const addStudentEmail = () => {
    if (studentEmail) {
      setStudentEmails([...studentEmails, studentEmail]);
      setStudentEmail('');
    }
  };

  const removeStudentEmail = (index) => {
    const updatedStudentEmails = [...studentEmails];
    updatedStudentEmails.splice(index, 1);
    setStudentEmails(updatedStudentEmails);
  };

  const handleClassDateChange = (e) => {
    setClassDate(e.target.value);
  };
  
  const handleClassTimeChange = (e) => {
    setClassTime(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/create-meeting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teacherEmail, studentEmail, classDate, classTime  }),
      });
      const response1 = await response.json();
      console.log(JSON.stringify(response1));
      alert(`Your meeting link is : ${response1}`); 
      // if (response.ok) {
      //   console.log('Meeting has been created', response);
      //    alert('Your meeting link is : '); 
      // } else {
      //   alert('Unable to create the meeting');
      //   console.error('Unable to create the meeting');
      // }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };
    
    // const meetingDetails = await createMeeting(
     
    // );

    // if (meetingDetails) {
    //   console.log('Zoom Meeting Details:', meetingDetails);
    // } else {
    //   console.log('Unable to create Zoom meeting');
    // }

  return (
    <div>
      {!showForm ? (
        <button onClick={toggleForm}>Create Classroom</button>
      ) : null}

      {showForm && (
        <div className="form-container">
          <button className="close-button" onClick={toggleForm}>X</button>
          <form onSubmit={handleSubmit}>
            <label>
              Teacher's Email:
              <input
                type="email"
                value={teacherEmail}
                onChange={handleTeacherEmailChange}
                required
              />
            </label>

            <label>
              Student's Email:
              <input
                type="email"
                value={studentEmail}
                onChange={handleStudentEmailChange}
              />
              <button type="button" onClick={addStudentEmail}>Add Student</button>
            </label>

            {studentEmails.length > 0 && (
              <div>
                <p>Students' Emails:</p>
                <ul>
                  {studentEmails.map((email, index) => (
                    <li key={index}>
                      {email}
                      <button type="button" className="cross-button" onClick={() => removeStudentEmail(index)}>
                        X
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

<label>
  Class Date:
  <input
    type="date"
    value={classDate}
    onChange={handleClassDateChange}
    required
  />
</label>

<label>
  Class Time:
  <input
    type="time"
    value={classTime}
    onChange={handleClassTimeChange}
    required
  />
</label>

            <button type="submit">Submit</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Home;