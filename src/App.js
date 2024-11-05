import React, { useState } from 'react';
import { Input, Button, Form, message } from 'antd';
import InputMask from 'react-input-mask';
import CryptoJS from 'crypto-js';

const initiatorName = 'Иван К.';
const fundraiserName = 'Экскурсия';

const App = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const validateCardNumber = (number) => {
    let sum = 0;
    let alternate = false;
    for (let i = number.length - 1; i >= 0; i--) {
      let n = parseInt(number.charAt(i), 10);
      if (alternate) {
        n *= 2;
        if (n > 9) n -= 9;
      }
      sum += n;
      alternate = !alternate;
    }
    return sum % 10 === 0;
  };

  const generateHash = (apiKey, transactionId, amount, secretKey) => {
    const data = `${apiKey}${transactionId}${amount * 100}${secretKey}`;
    return CryptoJS.SHA256(data).toString();
  };

  const onFinish = (values) => {
    if (!validateCardNumber(values.cardNumber.replace(/\s+/g, ''))) {
      message.error('Неверный номер карты!');
      return;
    }
    if (values.amount < 10) {
      message.error('Сумма перевода должна быть не менее 10 рублей!');
      return;
    }

    setLoading(true);

    const apiKey = '316b2be8-3475-4462-bd57-c7794d4bdb53';
    const transactionId = '3243243244324';
    const secretKey = '1234567890';
    const hashSum = generateHash(apiKey, transactionId, values.amount, secretKey);

    const postData = {
      hash_sum: hashSum,
      transaction: transactionId,
      description: `${initiatorName} собирает на ${fundraiserName}`,
      api_key: apiKey,
      amount: values.amount,
      custom_data: {
        initiatorName,
        fundraiserName,
      },
    };

    console.log('Отправка данных:', postData);

    setTimeout(() => {
      message.success('Данные успешно отправлены!');
      setLoading(false);
    }, 1000);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1>{initiatorName} собирает на «{fundraiserName}»</h1>
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item
          label="Номер карты"
          name="cardNumber"
          rules={[{ required: true, message: 'Введите номер карты!' }]}
        >
          <InputMask mask="9999 9999 9999 9999">
            {(inputProps) => <Input {...inputProps} placeholder="Введите номер карты" />}
          </InputMask>
        </Form.Item>
        <Form.Item
          label="Срок действия (ММ/ГГ)"
          name="expiryDate"
          rules={[{ required: true, message: 'Введите срок действия!' }]}
        >
          <InputMask mask="99/99">
            {(inputProps) => <Input {...inputProps} placeholder="ММ/ГГ" />}
          </InputMask>
        </Form.Item>
        <Form.Item
          label="CVV"
          name="cvv"
          rules={[{ required: true, message: 'Введите CVV!' }]}
        >
          <Input.Password maxLength={3} placeholder="CVV" />
        </Form.Item>
        <Form.Item
          label="Сумма перевода (₽)"
          name="amount"
          rules={[{ required: true, message: 'Введите сумму перевода!' }]}
        >
          <Input type="number" min={10} placeholder="Введите сумму" />
        </Form.Item>
        <Form.Item label="Ваше имя" name="name" rules={[{ required: true, max: 50 }]}>
          <Input placeholder="Введите имя" />
        </Form.Item>
        <Form.Item label="Сообщение получателю" name="message" rules={[{ max: 50 }]}>
          <Input placeholder="Введите сообщение" />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Перевести
        </Button>
        <Button type="default" style={{ marginLeft: '10px' }}>
          Вернуться
        </Button>
      </Form>
    </div>
  );
};

export default App;
