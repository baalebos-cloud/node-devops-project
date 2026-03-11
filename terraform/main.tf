provider "aws" {
  region  = var.aws_region
  profile = "devops"
}

resource "aws_vpc" "main_vpc" {
  cidr_block = "10.0.0.0/16"
}

resource "aws_subnet" "public_subnet" {
  vpc_id     = aws_vpc.main_vpc.id
  cidr_block = "10.0.1.0/24"
  map_public_ip_on_launch = true
}

resource "aws_security_group" "node_sg" {
  name        = "node-devops-sg"
  description = "Allow SSH and Node.js app traffic"

  ingress {
    from_port = 80
    to_port   = 80
    protocol  = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "SSH access"
    from_port = 22
    to_port   = 22
    protocol  = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Node.js app access"
    from_port = var.app_port
    to_port   = var.app_port
    protocol  = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "Allow all outbound traffic"
    from_port = 0
    to_port   = 0
    protocol  = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "node_server" {
  ami           = "ami-0c02fb55956c7d316" # Amazon Linux 2 AMI in us-east-1
  instance_type = var.instance_type
  key_name      = var.iam_key_name
  security_groups = [aws_security_group.node_sg.name]

  tags = {
    Name = var.instance_name
  }

  user_data = <<EOF
#!/bin/bash
docker run -d -p 80:3000 yourdockerhub/node-devops-app:latest
EOF
}
