# ElevenLabs AI Agent Setup

This guide will help you set up ElevenLabs AI Agent integration for voice conversations.

## Prerequisites

1. An ElevenLabs account with access to Conversational AI
2. An agent created in your ElevenLabs dashboard

## Setup Instructions

### 1. Get Your ElevenLabs API Key

1. Go to [ElevenLabs Dashboard](https://elevenlabs.io/app/settings/api-keys)
2. Click "Generate API Key" if you don't have one
3. Copy your API key

### 2. Get Your Agent ID

1. Navigate to [Conversational AI](https://elevenlabs.io/app/conversational-ai)
2. Create a new agent or select an existing one
3. Copy the Agent ID from the agent settings

### 3. Configure Environment Variables

Open the `.env` file in your project root and replace the placeholder values:

```env
VITE_ELEVENLABS_AGENT_ID=your_actual_agent_id
VITE_ELEVENLABS_API_KEY=your_actual_api_key
```

### 4. Restart Development Server

After updating the `.env` file, restart your development server to apply the changes.

## Usage

1. Click the voice button (phone icon) in the bottom action bar
2. Allow microphone access when prompted by your browser
3. Start speaking - the AI agent will listen and respond
4. Click the phone icon again (now showing a hang-up icon) to end the conversation

## Features

- Real-time voice conversation with AI agent
- WebSocket-based bidirectional audio streaming
- Visual feedback when connected and speaking
- Automatic audio queue management
- Interruption handling

## Troubleshooting

### "ElevenLabs credentials not configured" error
- Make sure you've added valid credentials to the `.env` file
- Restart your development server after updating `.env`

### Microphone access denied
- Check your browser settings to allow microphone access
- Make sure you're running the app over HTTPS (or localhost)

### Connection errors
- Verify your API key is valid and not expired
- Check that your agent ID is correct
- Ensure you have an active ElevenLabs subscription with Conversational AI access

## API Reference

The integration uses the ElevenLabs Conversational AI API:
- [Documentation](https://elevenlabs.io/docs/conversational-ai/overview)
- [API Reference](https://elevenlabs.io/docs/api-reference/websockets)
