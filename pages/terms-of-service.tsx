import Head from 'next/head'

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto py-10">
      <Head>
        <title>Terms of Service - LoanEase</title>
        <meta name="description" content="LoanEase terms of service and loan conditions" />
      </Head>
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <div className="space-y-4">
        <p>
          Welcome to LoanEase. By using our services, you agree to comply with and be bound by the following terms and conditions:
        </p>
        <h2 className="text-2xl font-semibold">Loan Terms</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Loan amounts range from KSh 5,000 to KSh 100,000.</li>
          <li>Interest rate is 20% for loans with repayment periods up to 6 months.</li>
          <li>Interest rate is 40% for loans with repayment periods over 6 months.</li>
          <li>There is no processing fee.</li>
          <li>Collateral of equal value to the loan amount is required.</li>
          <li>Repayment periods can be up to 6 months, with options for longer terms available.</li>
          <li>There is no minimum payment period; customers may make payments towards their principal at any time following disbursement.</li>
        </ul>
        <h2 className="text-2xl font-semibold">Application Process</h2>
        <p>
          To apply for a loan, you must provide accurate and truthful information. LoanEase reserves the right to verify the information provided and to reject any application that contains false or misleading information.
        </p>
        <h2 className="text-2xl font-semibold">Repayment</h2>
        <p>
          You are responsible for repaying your loan according to the agreed-upon terms. Failure to make timely payments may result in additional fees and negatively impact your credit score.
        </p>
        <h2 className="text-2xl font-semibold">Privacy</h2>
        <p>
          LoanEase is committed to protecting your privacy. We will only use your personal information for the purpose of processing your loan application and managing your account.
        </p>
        <h2 className="text-2xl font-semibold">Changes to Terms</h2>
        <p>
          LoanEase reserves the right to modify these terms and conditions at any time. Any changes will be effective immediately upon posting on our website.
        </p>
        <p>
          By using LoanEase services, you acknowledge that you have read, understood, and agree to be bound by these terms and conditions.
        </p>
      </div>
    </div>
  )
}

