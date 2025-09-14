const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Server is running!');
});

// Configure Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email service (e.g., Gmail, Outlook)
    auth: {
        user: 'agunbiadeadeshola58@gmail.com', // Replace with your email
        pass: 'czuy rykf qoie rgru', // Replace with your email password
    },
});

// Route to handle order submission
app.post('/submit-order', async (req, res) => {
    const {
        fullName,
        email,
        number,
        address,
        city,
        deliverydatetime,
        cartItems,
        totalAmount,
        transactionRef,
        deliveryOption,
    } = req.body;

    // Format cart items into HTML
    const cartItemsHTML = cartItems
        .map(
            (item) =>
                `<li>${item.quantity} x ${item.name} - ₦${(
                    item.price * item.quantity
                ).toFixed(2)}</li>`
        )
        .join('');

    // Email content
    const emailContent = `
    <h1>Order Summary</h1>
    <p><strong>Customer Name:</strong> ${fullName}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone Number:</strong> ${number}</p>
    <p><strong>Delivery Address:</strong> ${address}, ${city}</p>
    <p><strong>Delivery Date/Time:</strong> ${deliverydatetime}</p>
    <p><strong>Selected Delivery Option:</strong> ${deliveryOption}</p>
    <p><strong>Total Amount:</strong> ₦${totalAmount}</p>
    <p><strong>Transaction Reference:</strong> ${transactionRef}</p>
    <h2>Cart Items:</h2>
    <ul>${cartItemsHTML}</ul>
    `;

    const mailOptions = {
        from: 'agunbiadeadeshola58@gmail.com',
        to: 'agunbiadeadeshola10@gmail.com', // Replace with marketer's email
        subject: 'New Order Received',
        html: emailContent,
    };

    try {
        // Send the email
        await transporter.sendMail(mailOptions);
        console.log('Order email sent successfully');
        res.status(200).send({ message: 'Order received and email sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send({ message: 'Failed to send email.' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
