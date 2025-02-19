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

          <Box sx={{ mt: 2, mb: 3 }}>
            <Typography variant="body2" paragraph>
              Welcome to AVK Raja Yadav Trust. By accessing and using this
              website (the "Site") and its services, you agree to comply with
              and be bound by these Terms and Conditions. These terms govern the
              relationship between you and AVK Raja Yadav Trust ("we," "us,"
              "our"), in relation to your use of the Site, including any
              donations made through our online payment system.
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              1. Acceptance of Terms
            </Typography>
            <Typography variant="body2" paragraph>
              By using this Site, including the online donation system, you
              agree to be bound by these Terms and Conditions. If you do not
              agree to these terms, please do not use our Site.
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              2. Changes to Terms
            </Typography>
            <Typography variant="body2" paragraph>
              We reserve the right to modify, update, or change these Terms and
              Conditions at any time. Any changes will be posted on this page
              with the updated Effective Date. It is your responsibility to
              review these terms regularly.
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              3. Services Provided
            </Typography>
            <Typography variant="body2" paragraph>
              AVK Raja Yadav Trust operates a badminton court and accepts online
              donations to support our activities and provide assistance to
              others in need of financial support. We may use the donations to
              fund specific projects, help underprivileged individuals, or
              contribute to various charitable causes related to sports and
              community development.
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              4. Online Donations
            </Typography>
            <Box sx={{ pl: 2 }}>
              <Typography variant="body2" paragraph>
                ● Payment Process: Once you select the "Donate" option, you will
                be directed to a secure payment gateway to complete your
                donation via net banking, debit/credit card, or any other
                approved method.
              </Typography>
              <Typography variant="body2" paragraph>
                ● Payment Confirmation: After successful payment, you will
                receive a payment confirmation slip. Please keep this slip for
                your reference.
              </Typography>
              <Typography variant="body2" paragraph>
                ● Failed Transactions: If a payment does not go through, the
                system will display an error, and you will be advised to retry.
                If you suspect your account has been charged, please contact
                your bank or payment provider.
              </Typography>
            </Box>

            {/* Continue with the rest of the sections following the same pattern */}

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              17. Contact Information
            </Typography>
            <Typography variant="body2" paragraph>
              For any inquiries or issues related to donations, refunds, or any
              other terms, please contact us at:
            </Typography>
            <Box sx={{ pl: 2 }}>
              <Typography variant="body2">
                ● Email: avkrajayadavtrust@gmail.com
              </Typography>
              <Typography variant="body2">● Phone: +91 6385224527</Typography>
              <Typography variant="body2">
                ● Address: Kalukoorani Village, Vani Bustop, Ramanathapuram,
                TamilNadu - 623536
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default TermsModal;
