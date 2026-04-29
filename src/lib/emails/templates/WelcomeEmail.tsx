import * as React from 'react';
import { Html, Head, Preview, Body, Container, Section, Text, Img, Heading, Hr } from '@react-email/components';

interface WelcomeEmailProps {
  firstName: string;
}

export const WelcomeEmail: React.FC<Readonly<WelcomeEmailProps>> = ({ firstName }) => (
  <Html>
    <Head />
    <Preview>Welcome to GolfGive! Start tracking scores and making an impact.</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={h1}>Welcome to GolfGive ⛳</Heading>
        </Section>
        <Section style={content}>
          <Text style={text}>Hi {firstName},</Text>
          <Text style={text}>
            Thank you for joining GolfGive! We're thrilled to have you in our community.
            Your membership not only gives you a chance to win cash prizes but also directly supports vital charities.
          </Text>
          <Text style={text}>
            <strong>Next Steps:</strong>
            <br />1. Log in to your Dashboard
            <br />2. Choose the charity you want to support
            <br />3. Start entering your monthly golf scores!
          </Text>
          <Hr style={hr} />
          <Text style={footer}>
            GolfGive &copy; {new Date().getFullYear()}
            <br />Making every stroke count.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

const main = { backgroundColor: '#0a0a14', fontFamily: 'sans-serif' };
const container = { margin: '0 auto', padding: '20px 0 48px', width: '580px' };
const header = { padding: '32px', backgroundColor: '#111120', borderRadius: '8px 8px 0 0', textAlign: 'center' as const };
const h1 = { color: '#97ff2a', fontSize: '24px', margin: '0' };
const content = { padding: '32px', backgroundColor: '#1c1c30', borderRadius: '0 0 8px 8px' };
const text = { color: '#ffffff', fontSize: '16px', lineHeight: '24px', marginBottom: '16px' };
const hr = { borderColor: '#2c2c48', margin: '20px 0' };
const footer = { color: '#888888', fontSize: '12px', textAlign: 'center' as const };
