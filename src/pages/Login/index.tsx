import { LoginPayload } from '@/configs/api/payload';
import { ROUTER } from '@/configs/router';
import { useAuthContext } from '@/hooks/context';
import {
  Box,
  Button,
  Card,
  Center,
  Stack,
  Text,
  TextInput
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconLock, IconUser } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const {
    login,
    state: { isFetching }
  } = useAuthContext();

  const initialValues: LoginPayload = { username: '', password: '' };
  const form = useForm({ initialValues });

  return (
    <Box pos="relative">
      <Text tt="uppercase" align="center" fw="700" fz={28}>
        Đăng nhập
      </Text>
      <Text align="center" color="dimmed" fz="xl">
        Chào mừng quay trở lại. Đăng nhập để tiếp tục
      </Text>
      <Center mt="sm">
        <Card shadow="md" w={360}>
          <form
            onSubmit={form.onSubmit((values) => {
              login(values, {
                onSuccess: () => {
                  navigate(ROUTER.BASE);
                }
              });
            })}
          >
            <Stack>
              <TextInput
                label="Tên đăng nhập"
                placeholder="Nhập tên đăng nhập..."
                icon={<IconUser size={14} />}
                {...form.getInputProps('username')}
              />
              <TextInput
                label="Mật khẩu"
                type="password"
                placeholder="Nhập mật khẩu..."
                icon={<IconLock size={14} />}
                {...form.getInputProps('password')}
              />
              <Button
                loading={isFetching}
                color="blue.9"
                variant="filled"
                fullWidth
                type="submit"
              >
                Đăng nhập
              </Button>
            </Stack>
          </form>
        </Card>
      </Center>
    </Box>
  );
};

export default Login;
