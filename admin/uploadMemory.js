const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const API_URL = 'http://localhost:5000/api/memories';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askQuestion = (question) => {
  return new Promise((resolve) => rl.question(question, resolve));
};

const uploadMemory = async () => {
  try {
    const title = await askQuestion('Title: ');
    const category = await askQuestion('Category: ');
    const date = await askQuestion('Date (YYYY-MM-DD): ');
    const description = await askQuestion('Description: ');
    const imagePath = await askQuestion('Image Path: ');

    const form = new FormData();
    form.append('title', title);
    form.append('category', category);
    form.append('date', date);
    form.append('description', description);

    if (imagePath) {
      form.append('image', fs.createReadStream(path.resolve(imagePath)));
    }

    const response = await axios.post(API_URL, form, {
      headers: {
        ...form.getHeaders(),
      },
    });

    console.log('Memory uploaded successfully:', response.data);
  } catch (error) {
    console.error('Error uploading memory:', error);
  } finally {
    rl.close();
  }
};

uploadMemory();
