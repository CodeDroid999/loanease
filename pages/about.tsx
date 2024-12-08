import Head from 'next/head'

export default function AboutPage() {
  return (
    <div className="container mx-auto py-10">
      <Head>
        <title>About LoanEase - Quick and Easy Loans</title>
        <meta name="description" content="Learn about LoanEase and our mission to provide quick and easy loans" />
      </Head>
      <h1 className="text-4xl font-bold mb-6">About LoanEase</h1>
      <div className="space-y-6">
        <p>
          LoanEase is a cutting-edge financial technology company dedicated to making the loan application process quick, easy, and accessible to everyone. Our mission is to empower individuals and small businesses by providing them with the financial resources they need to achieve their goals.
        </p>
        <p>
          Founded in 2023, LoanEase has quickly become a leader in the online lending industry. We leverage advanced technology and data analytics to offer personalized loan solutions that meet the unique needs of each customer.
        </p>
        <p>
          At LoanEase, we believe in:
        </p>
        <ul className="list-disc list-inside">
          <li>Transparency in all our operations</li>
          <li>Exceptional customer service</li>
          <li>Innovative financial solutions</li>
          <li>Responsible lending practices</li>
        </ul>
        <p>
          Our team of financial experts and technology professionals work tirelessly to ensure that every customer has a smooth and satisfying experience with LoanEase. We're committed to continuous improvement and are always looking for ways to enhance our services and better serve our customers.
        </p>
      </div>
    </div>
  )
}

