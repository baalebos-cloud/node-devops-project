variable "aws_region" {
  description = "AWS region where infrastructure will be created"
  type        = string
  default     = "us-east-1"
}

variable "instance_type" {
  description = "EC2 instance type for the Node.js application"
  type        = string
  default     = "t3.micro"
}

variable "instance_name" {
  description = "Name tag for the EC2 instance"
  type        = string
  default     = "node-devops-server"
}

variable "iam_key_name" {
  description = "Name of the AWS SSH key pair to use for EC2"
  type        = string
  default     = "devops-key"
}

variable "public_key_path" {
  description = "Path to the SSH public key used for EC2 access"
  type        = string
  default     = "~/.ssh/id_rsa.pub"
}

variable "app_port" {
  description = "Port where the Node.js application runs"
  type        = number
  default     = 3000
}

variable "vpc_id" {}
variable "public_subnets" {
  type = list(string)
}
variable "acm_certificate_arn" {}
