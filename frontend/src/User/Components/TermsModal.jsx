import React from "react";
import { Box, Typography, IconButton, Modal } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

const TermsModal = ({ open, onClose }) => {
  return (
    <Modal open={open} onClose={onClose} aria-labelledby="terms-title">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: 600, md: 700 },
          maxHeight: "90vh",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          overflowY: "auto",
        }}
      >
        <Box sx={{ position: "relative" }}>
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              right: -12,
              top: -12,
              color: "grey.600",
              "&:hover": {
                color: "grey.900",
              },
            }}
          >
            <CloseIcon />
          </IconButton>

          <Typography
            id="terms-title"
            variant="h5"
            gutterBottom
            fontWeight="bold"
          >
            Terms & Conditions
          </Typography>

          <Typography variant="body2" paragraph>
            Welcome to <strong>AVK Raja Yadav Trust</strong>. By accessing and
            using this website (the "Site") and its services, you agree to
            comply with and be bound by these{" "}
            <strong>Terms and Conditions</strong>. These terms govern the
            relationship between you and AVK Raja Yadav Trust ("we," "us,"
            "our"), in relation to your use of the Site, including any donations
            made through our online payment system.
          </Typography>

          <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold" }}>
            1. Acceptance of Terms
          </Typography>
          <Typography variant="body2" paragraph>
            By using this Site, including the online donation system, you agree
            to be bound by these Terms and Conditions. If you do not agree to
            these terms, please do not use our Site.
          </Typography>

          <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold" }}>
            2. Changes to Terms
          </Typography>
          <Typography variant="body2" paragraph>
            We reserve the right to modify, update, or change these Terms and
            Conditions at any time. Any changes will be posted on this page with
            the updated <strong>Effective Date</strong>. It is your
            responsibility to review these terms regularly.
          </Typography>

          <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold" }}>
            3. Services Provided
          </Typography>
          <Typography variant="body2" paragraph>
            AVK Raja Yadav Trust operates a badminton court and accepts online
            donations to support our activities and provide assistance to others
            in need of financial support. We may use the donations to fund
            specific projects, help underprivileged individuals, or contribute
            to various charitable causes related to sports and community
            development.
          </Typography>

          <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold" }}>
            4. Online Donations
          </Typography>
          <Box sx={{ pl: 2 }}>
            <Typography variant="body2" sx={{ display: "flex", mb: 1 }}>
              <Box component="span" sx={{ mr: 1 }}>
                •
              </Box>
              <Box>
                <strong>Payment Process</strong>: Once you select the "Donate"
                option, you will be directed to a secure payment gateway to
                complete your donation via <strong>net banking</strong>,{" "}
                <strong>debit/credit card</strong>, or any other approved
                method.
              </Box>
            </Typography>
            <Typography variant="body2" sx={{ display: "flex", mb: 1 }}>
              <Box component="span" sx={{ mr: 1 }}>
                •
              </Box>
              <Box>
                <strong>Payment Confirmation</strong>: After successful payment,
                you will receive a payment confirmation slip. Please keep this
                slip for your reference.
              </Box>
            </Typography>
            <Typography variant="body2" sx={{ display: "flex", mb: 1 }}>
              <Box component="span" sx={{ mr: 1 }}>
                •
              </Box>
              <Box>
                <strong>Failed Transactions</strong>: If a payment does not go
                through, the system will display an error, and you will be
                advised to retry. If you suspect your account has been charged,
                please contact your bank or payment provider.
              </Box>
            </Typography>
          </Box>

          <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold" }}>
            5. Donor Information
          </Typography>
          <Box sx={{ pl: 2 }}>
            <Typography variant="body2" sx={{ display: "flex", mb: 1 }}>
              <Box component="span" sx={{ mr: 1 }}>
                •
              </Box>
              <Box>
                <strong>Anonymous Donations</strong>: We do not accept anonymous
                donations. However, if you wish to remain anonymous, please
                contact us at [Insert Contact Information].
              </Box>
            </Typography>
            <Typography variant="body2" sx={{ display: "flex", mb: 1 }}>
              <Box component="span" sx={{ mr: 1 }}>
                •
              </Box>
              <Box>
                <strong>Data Security</strong>: We take your privacy seriously.
                Your personal and payment details are never shared with third
                parties. Sensitive payment information, such as credit card
                details, is not stored on our servers.
              </Box>
            </Typography>
          </Box>

          <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold" }}>
            6. Use of Donations
          </Typography>
          <Box sx={{ pl: 2 }}>
            <Typography variant="body2" sx={{ display: "flex", mb: 1 }}>
              <Box component="span" sx={{ mr: 1 }}>
                •
              </Box>
              <Box>
                Donations can be earmarked for specific projects or causes as
                per your request.
              </Box>
            </Typography>
            <Typography variant="body2" sx={{ display: "flex", mb: 1 }}>
              <Box component="span" sx={{ mr: 1 }}>
                •
              </Box>
              <Box>
                By donating, you confirm that you are making a contribution out
                of your own funds and in compliance with local laws.
              </Box>
            </Typography>
          </Box>

          <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold" }}>
            7. Refund Policy
          </Typography>
          <Box sx={{ pl: 2 }}>
            <Typography variant="body2" sx={{ display: "flex", mb: 1 }}>
              <Box component="span" sx={{ mr: 1 }}>
                •
              </Box>
              <Box>
                In case of duplicate payments or errors, please contact us with
                the transaction reference. Refunds will be processed within{" "}
                <strong>10-15 working days</strong>.
              </Box>
            </Typography>
            <Typography variant="body2" sx={{ display: "flex", mb: 1 }}>
              <Box component="span" sx={{ mr: 1 }}>
                •
              </Box>
              <Box>
                Refunds will be processed via the same payment gateway and
                credited back to your account.
              </Box>
            </Typography>
          </Box>

          <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold" }}>
            8. Cancellation Policy
          </Typography>
          <Typography variant="body2" paragraph>
            In exceptional circumstances, we offer a{" "}
            <strong>cancellation policy</strong>. If you wish to cancel your
            donation, please contact us as soon as possible.
          </Typography>

          <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold" }}>
            9. Limitations of Liability
          </Typography>
          <Box sx={{ pl: 2 }}>
            <Typography variant="body2" sx={{ display: "flex", mb: 1 }}>
              <Box component="span" sx={{ mr: 1 }}>
                •
              </Box>
              <Box>
                <strong>Accuracy</strong>: While we take all necessary steps to
                ensure the accuracy of the donation details, AVK Raja Yadav
                Trust is not responsible for any errors in the payment process.
              </Box>
            </Typography>
            <Typography variant="body2" sx={{ display: "flex", mb: 1 }}>
              <Box component="span" sx={{ mr: 1 }}>
                •
              </Box>
              <Box>
                <strong>Loss or Damage</strong>: We are not liable for any
                indirect, incidental, or consequential damages arising from your
                use of this website, including any loss of data or profits.
              </Box>
            </Typography>
          </Box>

          <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold" }}>
            10. Governing Law
          </Typography>
          <Typography variant="body2" paragraph>
            Any claim relating to Mother Teresa Charitable Trust web site shall
            be governed by the laws of the Republic of India, and also the State
            of Tamil Nadu without regard to its conflict of law provisions. We
            are committed to conducting our business in accordance with these
            principles in order to ensure that the confidentiality of personal
            information is protected and maintained.
          </Typography>

          <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold" }}>
            11. User Account and Conduct
          </Typography>
          <Box sx={{ pl: 2 }}>
            <Typography variant="body2" sx={{ display: "flex", mb: 1 }}>
              <Box component="span" sx={{ mr: 1 }}>
                •
              </Box>
              <Box>
                <strong>Account Creation</strong>: You may be required to create
                an account for certain features of the website. You agree to
                provide accurate, current, and complete information during the
                registration process.
              </Box>
            </Typography>
            <Typography variant="body2" sx={{ display: "flex", mb: 1 }}>
              <Box component="span" sx={{ mr: 1 }}>
                •
              </Box>
              <Box>
                <strong>Proper Use</strong>: You agree to use this Site for
                lawful purposes and not engage in any activities that may harm,
                disrupt, or interfere with the operation of the website or its
                services.
              </Box>
            </Typography>
          </Box>

          <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold" }}>
            12. Privacy Policy
          </Typography>
          <Typography variant="body2" paragraph>
            Your privacy is important to us. Please refer to our{" "}
            <strong>Privacy Policy</strong> to understand how your personal and
            payment data is collected, used, and protected.
          </Typography>

          <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold" }}>
            13. Cookies
          </Typography>
          <Typography variant="body2" paragraph>
            We may use cookies to enhance your browsing experience. Cookies are
            small files that store your preferences and help us track site
            usage.
          </Typography>

          <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold" }}>
            14. Third-Party Links
          </Typography>
          <Typography variant="body2" paragraph>
            Our Site may contain links to third-party websites. We are not
            responsible for the content, privacy practices, or terms of these
            external sites. Use them at your own risk.
          </Typography>

          <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold" }}>
            15. Indemnification
          </Typography>
          <Typography variant="body2" paragraph>
            By using our Site and making donations, you agree to indemnify and
            hold AVK Raja Yadav Trust, its affiliates, and its officers harmless
            from any claims, damages, or liabilities arising from your actions
            or the use of the website.
          </Typography>

          <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold" }}>
            16. Termination of Access
          </Typography>
          <Typography variant="body2" paragraph>
            We reserve the right to suspend or terminate your access to the Site
            if you violate any of the Terms and Conditions or engage in illegal
            activities.
          </Typography>

          <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold" }}>
            17. Contact Information
          </Typography>
          <Typography variant="body2" paragraph>
            For any inquiries or issues related to donations, refunds, or any
            other terms, please contact us at:
          </Typography>
          <Box sx={{ pl: 2 }}>
            <Typography variant="body2" sx={{ display: "flex", mb: 1 }}>
              <Box component="span" sx={{ mr: 1 }}>
                •
              </Box>
              <Box>
                <strong>Email</strong>: avkrajayadavtrust@gmail.com
              </Box>
            </Typography>
            <Typography variant="body2" sx={{ display: "flex", mb: 1 }}>
              <Box component="span" sx={{ mr: 1 }}>
                •
              </Box>
              <Box>
                <strong>Phone</strong>: +91 6385224527
              </Box>
            </Typography>
            <Typography variant="body2" sx={{ display: "flex", mb: 1 }}>
              <Box component="span" sx={{ mr: 1 }}>
                •
              </Box>
              <Box>
                <strong>Address</strong>: Kalukoorani Village, Vani Bustop,
                Ramanathapuram, TamilNadu - 623536
              </Box>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default TermsModal;
